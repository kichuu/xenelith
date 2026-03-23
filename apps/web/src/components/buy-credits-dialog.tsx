"use client";

import { env } from "@interior-design-ai/env/web";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@interior-design-ai/ui/components/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useCreditsContext } from "@/components/credits-provider";
import { api } from "@/lib/api-client";
import { openRazorpayCheckout } from "@/lib/razorpay";

interface CreateOrderResponse {
	orderId: string;
	razorpayOrderId: string;
	amount: number;
	currency: string;
}

export function BuyCreditsDialog() {
	const { plans, isBuyDialogOpen, closeBuyDialog, refetch } =
		useCreditsContext();
	const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

	const handleBuy = async (planId: string) => {
		setLoadingPlanId(planId);
		try {
			const data = await api.post<CreateOrderResponse>(
				"/credits/orders",
				{ planId },
			);

			await openRazorpayCheckout({
				key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
				amount: data.amount,
				currency: data.currency,
				name: "Editorial Futurism",
				description: "Design Credits",
				order_id: data.razorpayOrderId,
				handler: async (response) => {
					try {
						await api.post("/credits/verify", {
							razorpayOrderId: response.razorpay_order_id,
							razorpayPaymentId: response.razorpay_payment_id,
							razorpaySignature: response.razorpay_signature,
						});
						await refetch();
						closeBuyDialog();
						toast.success("Credits added successfully");
					} catch {
						toast.error("Payment verification failed");
					}
				},
				modal: {
					ondismiss: () => setLoadingPlanId(null),
				},
				theme: {
					color: "#b8a04a",
				},
			});
		} catch {
			toast.error("Failed to create order");
		} finally {
			setLoadingPlanId(null);
		}
	};

	return (
		<Dialog open={isBuyDialogOpen} onOpenChange={closeBuyDialog}>
			<DialogHeader>
				<DialogTitle>Acquire Credits</DialogTitle>
				<DialogClose onClick={closeBuyDialog} />
			</DialogHeader>
			<DialogContent>
				<p className="text-[11px] text-ef-text-secondary tracking-wide">
					Each synthesis consumes 1 credit. Select a plan below.
				</p>
				<div className="grid gap-3">
					{plans.map((plan) => (
						<button
							key={plan.id}
							type="button"
							disabled={loadingPlanId !== null}
							onClick={() => handleBuy(plan.id)}
							className="flex items-center justify-between border border-ef-border p-4 text-left transition-colors hover:border-ef-gold/40 hover:bg-ef-gold/5 disabled:opacity-50"
						>
							<div>
								<span className="text-sm text-ef-text-primary">
									{plan.credits} Credits
								</span>
								<span className="ml-2 text-[11px] text-ef-text-secondary">
									{plan.credits === 5 && "Starter"}
									{plan.credits === 12 && "Popular"}
									{plan.credits === 30 && "Best Value"}
								</span>
							</div>
							<span className="font-mono text-sm text-ef-gold">
								{loadingPlanId === plan.id
									? "..."
									: `₹${plan.amountPaise / 100}`}
							</span>
						</button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
