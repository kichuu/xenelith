import prisma from "@interior-design-ai/db";
import { env } from "@interior-design-ai/env/server";
import { Router, type Router as RouterType } from "express";
import { paygate } from "../lib/paygate.js";
import {
	PLANS,
	calculateCreditsForAmount,
	getPlanById,
} from "../lib/plans.js";
import { validate } from "../lib/validate.js";
import { createOrderSchema, verifyPaymentSchema } from "./payments.schema.js";

const router: RouterType = Router();

// GET /api/v1/credits — balance + available plans
router.get("/", async (req, res) => {
	const profile = await prisma.userProfile.findUniqueOrThrow({
		where: { id: req.userProfile!.id },
		select: { creditBalance: true },
	});

	res.json({ balance: profile.creditBalance, plans: PLANS });
});

// POST /api/v1/credits/orders — create order (plan or custom amount)
router.post("/orders", validate(createOrderSchema), async (req, res) => {
	const { planId, amount: customAmount } = req.body as {
		planId?: string;
		amount?: number;
	};

	let credits: number;
	let amountPaise: number;
	let planLabel: string;

	if (planId) {
		const plan = getPlanById(planId);
		if (!plan) {
			res.status(400).json({ error: "Invalid plan" });
			return;
		}
		credits = plan.credits;
		amountPaise = plan.amountPaise;
		planLabel = plan.id;
	} else if (customAmount) {
		const calculatedCredits = calculateCreditsForAmount(customAmount);
		if (!calculatedCredits) {
			res.status(400).json({ error: "Minimum amount is ₹10" });
			return;
		}
		credits = calculatedCredits;
		amountPaise = customAmount;
		planLabel = "custom";
	} else {
		res.status(400).json({ error: "Provide planId or amount" });
		return;
	}

	const pgOrder = await paygate.createOrder({
		user_id: req.userProfile!.id,
		amount: amountPaise,
		currency: "INR",
		gateway: "razorpay",
		description: `${credits} design credits`,
		metadata: {
			app_success_url: `${env.FRONTEND_URL}/dashboard?payment=success`,
		},
	});

	const order = await prisma.order.create({
		data: {
			userId: req.userProfile!.id,
			planId: planLabel,
			credits,
			amountPaise,
			razorpayOrderId: pgOrder.gateway_order_id,
			paygateOrderId: pgOrder.order_id,
		},
	});

	res.status(201).json({
		orderId: order.id,
		checkoutUrl: `${env.PAYGATE_URL}/checkout/${pgOrder.order_id}`,
		credits,
		amount: amountPaise,
		currency: "INR",
	});
});

// POST /api/v1/credits/verify — verify payment via PayGate and grant credits
router.post("/verify", validate(verifyPaymentSchema), async (req, res) => {
	const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
		req.body as {
			razorpayOrderId: string;
			razorpayPaymentId: string;
			razorpaySignature: string;
		};

	const order = await prisma.order.findUnique({
		where: { razorpayOrderId },
	});

	if (!order) {
		res.status(404).json({ error: "Order not found" });
		return;
	}

	if (order.status === "PAID") {
		res.json({ message: "Payment already verified" });
		return;
	}

	if (order.userId !== req.userProfile!.id) {
		res.status(403).json({ error: "Forbidden" });
		return;
	}

	await paygate.verifyPayment({
		order_id: order.paygateOrderId!,
		gateway_payment_id: razorpayPaymentId,
		gateway_signature: razorpaySignature,
	});

	const result = await grantCredits(order.id);
	res.json({ message: "Payment verified", balance: result.balance });
});

// Webhook router (public, no auth)
export const webhookRouter: RouterType = Router();
webhookRouter.post("/", async (req, res) => {
	const { order_id, status, gateway_payment_id } = req.body as {
		order_id: string;
		status: string;
		gateway_payment_id?: string;
	};

	if (status !== "paid") {
		res.json({ received: true });
		return;
	}

	const order = await prisma.order.findFirst({
		where: { paygateOrderId: order_id },
	});

	if (!order) {
		res.status(404).json({ error: "Order not found" });
		return;
	}

	if (order.status === "PAID") {
		res.json({ received: true, already_processed: true });
		return;
	}

	await grantCredits(order.id, gateway_payment_id);
	res.json({ received: true, credits_granted: true });
});

// POST /api/v1/credits/sync — check PayGate for any unpaid orders and grant credits
router.post("/sync", async (req, res) => {
	const pendingOrders = await prisma.order.findMany({
		where: { userId: req.userProfile!.id, status: "CREATED" },
		orderBy: { createdAt: "desc" },
		take: 5,
	});

	let credited = 0;
	for (const order of pendingOrders) {
		if (!order.paygateOrderId) continue;
		try {
			const pgOrder = await paygate.getOrder(order.paygateOrderId);
			if (pgOrder.status === "paid") {
				await grantCredits(order.id);
				credited += order.credits;
			}
		} catch {
			// Order might not exist or be pending — skip
		}
	}

	const profile = await prisma.userProfile.findUniqueOrThrow({
		where: { id: req.userProfile!.id },
		select: { creditBalance: true },
	});

	res.json({ balance: profile.creditBalance, credited });
});

// GET /api/v1/credits/history — transaction history
router.get("/history", async (req, res) => {
	const transactions = await prisma.creditTransaction.findMany({
		where: { userId: req.userProfile!.id },
		orderBy: { createdAt: "desc" },
		take: 50,
	});

	res.json({ transactions });
});

// Shared credit granting logic
async function grantCredits(orderId: string, paymentId?: string) {
	return prisma.$transaction(async (tx) => {
		const order = await tx.order.findUniqueOrThrow({
			where: { id: orderId },
		});

		if (order.status === "PAID") {
			return { balance: -1 };
		}

		await tx.order.update({
			where: { id: order.id },
			data: {
				status: "PAID",
				...(paymentId && { razorpayPaymentId: paymentId }),
			},
		});

		const updatedProfile = await tx.userProfile.update({
			where: { id: order.userId },
			data: { creditBalance: { increment: order.credits } },
			select: { creditBalance: true },
		});

		await tx.creditTransaction.create({
			data: {
				userId: order.userId,
				type: "CREDIT_PURCHASE",
				amount: order.credits,
				balanceAfter: updatedProfile.creditBalance,
				orderId: order.id,
			},
		});

		return { balance: updatedProfile.creditBalance };
	});
}

export default router;
