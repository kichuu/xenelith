import { env } from "@interior-design-ai/env/server";

interface PayGateOrderRequest {
	user_id: string;
	amount: number;
	currency: string;
	gateway: string;
	description?: string;
	metadata?: Record<string, string>;
}

interface PayGateOrderResponse {
	order_id: string;
	gateway_order_id: string;
	amount: number;
	currency: string;
	status: string;
	gateway_data: {
		key: string;
		order_id: string;
	};
}

interface PayGateVerifyRequest {
	order_id: string;
	gateway_payment_id: string;
	gateway_signature: string;
}

interface PayGateVerifyResponse {
	payment_id: string;
	order_id: string;
	status: string;
	amount: number;
}

async function request<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${env.PAYGATE_URL}/api/v1${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	const data = (await res.json()) as T & { error?: string };

	if (!res.ok) {
		throw new Error(data.error || `PayGate error: ${res.status}`);
	}

	return data as T;
}

interface PayGateOrderDetail {
	ID: string;
	Status: string;
	Amount: number;
	Currency: string;
	GatewayOrderID: string;
}

export const paygate = {
	createOrder: (body: PayGateOrderRequest) =>
		request<PayGateOrderResponse>("/orders", {
			method: "POST",
			body: JSON.stringify(body),
		}),

	getOrder: (orderId: string) =>
		request<PayGateOrderDetail>(`/orders/${orderId}`),

	verifyPayment: (body: PayGateVerifyRequest) =>
		request<PayGateVerifyResponse>("/payments/verify", {
			method: "POST",
			body: JSON.stringify(body),
		}),
};
