export interface Plan {
	id: string;
	credits: number;
	amountPaise: number;
	label: string;
}

export const PLANS: Plan[] = [
	{ id: "plan_5", credits: 5, amountPaise: 5000, label: "5 Credits — ₹50" },
	{ id: "plan_12", credits: 12, amountPaise: 10000, label: "12 Credits — ₹100" },
	{ id: "plan_30", credits: 30, amountPaise: 20000, label: "30 Credits — ₹200" },
];

export function getPlanById(id: string): Plan | undefined {
	return PLANS.find((p) => p.id === id);
}

// Rate: ₹10 per credit (1000 paise per credit)
const PAISE_PER_CREDIT = 1000;
const MIN_AMOUNT_PAISE = 1000; // ₹10 minimum

export function calculateCreditsForAmount(amountPaise: number): number | null {
	if (amountPaise < MIN_AMOUNT_PAISE) return null;
	return Math.floor(amountPaise / PAISE_PER_CREDIT);
}
