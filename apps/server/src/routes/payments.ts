import { createHmac } from "node:crypto";
import prisma from "@interior-design-ai/db";
import { env } from "@interior-design-ai/env/server";
import { Router, type Router as RouterType } from "express";
import { PLANS, getPlanById } from "../lib/plans.js";
import { razorpay } from "../lib/razorpay.js";
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

// POST /api/v1/credits/orders — create Razorpay order for a plan
router.post("/orders", validate(createOrderSchema), async (req, res) => {
	const { planId } = req.body as { planId: string };
	const plan = getPlanById(planId);

	if (!plan) {
		res.status(400).json({ error: "Invalid plan" });
		return;
	}

	const razorpayOrder = await razorpay.orders.create({
		amount: plan.amountPaise,
		currency: "INR",
		notes: {
			userId: req.userProfile!.id,
			planId: plan.id,
		},
	});

	const order = await prisma.order.create({
		data: {
			userId: req.userProfile!.id,
			planId: plan.id,
			credits: plan.credits,
			amountPaise: plan.amountPaise,
			razorpayOrderId: razorpayOrder.id,
		},
	});

	res.status(201).json({
		orderId: order.id,
		razorpayOrderId: razorpayOrder.id,
		amount: plan.amountPaise,
		currency: "INR",
	});
});

// POST /api/v1/credits/verify — verify payment signature and grant credits
router.post("/verify", validate(verifyPaymentSchema), async (req, res) => {
	const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
		req.body as {
			razorpayOrderId: string;
			razorpayPaymentId: string;
			razorpaySignature: string;
		};

	// HMAC-SHA256 verification
	const expectedSignature = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
		.update(`${razorpayOrderId}|${razorpayPaymentId}`)
		.digest("hex");

	if (expectedSignature !== razorpaySignature) {
		res.status(400).json({ error: "Invalid payment signature" });
		return;
	}

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
