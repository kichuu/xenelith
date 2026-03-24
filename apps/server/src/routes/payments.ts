import prisma from "@interior-design-ai/db";
import { Router, type Router as RouterType } from "express";
import { paygate } from "../lib/paygate.js";
import { PLANS, getPlanById } from "../lib/plans.js";
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

// POST /api/v1/credits/orders — create order via PayGate
router.post("/orders", validate(createOrderSchema), async (req, res) => {
	const { planId } = req.body as { planId: string };
	const plan = getPlanById(planId);

	if (!plan) {
		res.status(400).json({ error: "Invalid plan" });
		return;
	}

	const pgOrder = await paygate.createOrder({
		user_id: req.userProfile!.id,
		amount: plan.amountPaise,
		currency: "INR",
		gateway: "razorpay",
		description: `${plan.credits} design credits`,
	});

	const order = await prisma.order.create({
		data: {
			userId: req.userProfile!.id,
			planId: plan.id,
			credits: plan.credits,
			amountPaise: plan.amountPaise,
			razorpayOrderId: pgOrder.gateway_order_id,
			paygateOrderId: pgOrder.order_id,
		},
	});

	res.status(201).json({
		orderId: order.id,
		razorpayOrderId: pgOrder.gateway_order_id,
		razorpayKey: pgOrder.gateway_data.key,
		amount: plan.amountPaise,
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

	// Verify via PayGate (which verifies with Razorpay)
	await paygate.verifyPayment({
		order_id: order.paygateOrderId!,
		gateway_payment_id: razorpayPaymentId,
		gateway_signature: razorpaySignature,
	});

	// Atomic: update order + increment balance + create transaction
	const result = await prisma.$transaction(async (tx) => {
		await tx.order.update({
			where: { id: order.id },
			data: {
				status: "PAID",
				razorpayPaymentId,
				razorpaySignature,
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

	res.json({ message: "Payment verified", balance: result.balance });
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

export default router;
