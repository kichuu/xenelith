import { z } from "zod";

export const createOrderSchema = z.object({
	planId: z.string().min(1).optional(),
	amount: z.number().int().min(1000).optional(),
});

export const verifyPaymentSchema = z.object({
	razorpayOrderId: z.string().min(1),
	razorpayPaymentId: z.string().min(1),
	razorpaySignature: z.string().min(1),
});

export const webhookSchema = z.object({
	order_id: z.string().min(1),
	status: z.string().min(1),
	gateway_payment_id: z.string().optional(),
});
