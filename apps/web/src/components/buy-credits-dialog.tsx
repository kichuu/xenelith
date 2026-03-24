"use client";

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

interface CreateOrderResponse {
	orderId: string;
	checkoutUrl: string;
	credits: number;
	amount: number;
	currency: string;
}

export function BuyCreditsDialog() {
	const { plans, isBuyDialogOpen, closeBuyDialog } = useCreditsContext();
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [customAmount, setCustomAmount] = useState("");
	const customCredits = Math.floor(Number(customAmount) / 10) || 0;

	const handleBuyPlan = async (planId: string) => {
		setLoadingId(planId);
		try {
			const data = await api.post<CreateOrderResponse>(
				"/credits/orders",
				{ planId },
			);
			window.location.href = data.checkoutUrl;
		} catch {
			toast.error("Failed to create order");
			setLoadingId(null);
		}
	};

	const handleBuyCustom = async () => {
		const amountPaise = Number(customAmount) * 100;
		if (amountPaise < 1000) {
			toast.error("Minimum amount is ₹10");
			return;
		}
		setLoadingId("custom");
		try {
			const data = await api.post<CreateOrderResponse>(
				"/credits/orders",
				{ amount: amountPaise },
			);
			window.location.href = data.checkoutUrl;
		} catch {
			toast.error("Failed to create order");
			setLoadingId(null);
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
					Each synthesis consumes 1 credit. Select a plan or enter a
					custom amount.
				</p>
				<div className="grid gap-3">
					{plans.map((plan) => (
						<button
							key={plan.id}
							type="button"
							disabled={loadingId !== null}
							onClick={() => handleBuyPlan(plan.id)}
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
								{loadingId === plan.id
									? "..."
									: `₹${plan.amountPaise / 100}`}
							</span>
						</button>
					))}
				</div>

				{/* Custom amount */}
				<div className="mt-4 border-t border-ef-border pt-4">
					<p className="mb-2 text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Custom Amount
					</p>
					<div className="flex gap-2">
						<div className="relative flex-1">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ef-text-secondary">
								₹
							</span>
							<input
								type="number"
								min="10"
								step="10"
								value={customAmount}
								onChange={(e) =>
									setCustomAmount(e.target.value)
								}
								placeholder="100"
								className="h-10 w-full border border-ef-border bg-ef-bg-deep pl-7 pr-3 text-sm text-ef-text-primary outline-none placeholder:text-ef-text-secondary/50 focus:border-ef-gold/40"
							/>
						</div>
						<button
							type="button"
							disabled={
								loadingId !== null || customCredits < 1
							}
							onClick={handleBuyCustom}
							className="h-10 border border-ef-accent bg-ef-accent/10 px-4 text-[11px] text-ef-accent uppercase tracking-widest transition-colors hover:bg-ef-accent/20 disabled:opacity-50"
						>
							{loadingId === "custom"
								? "..."
								: customCredits > 0
									? `${customCredits} Credits`
									: "Enter Amount"}
						</button>
					</div>
					<p className="mt-1.5 text-[10px] text-ef-text-secondary">
						₹10 per credit. Minimum ₹10.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
