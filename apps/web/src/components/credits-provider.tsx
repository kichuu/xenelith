"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { type Plan, useCredits } from "@/hooks/use-credits";

interface CreditsContextValue {
	balance: number;
	plans: Plan[];
	loading: boolean;
	refetch: () => Promise<void>;
	openBuyDialog: () => void;
	isBuyDialogOpen: boolean;
	closeBuyDialog: () => void;
}

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
	const { balance, plans, loading, refetch } = useCredits();
	const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

	const openBuyDialog = useCallback(() => setIsBuyDialogOpen(true), []);
	const closeBuyDialog = useCallback(() => setIsBuyDialogOpen(false), []);

	return (
		<CreditsContext.Provider
			value={{
				balance,
				plans,
				loading,
				refetch,
				openBuyDialog,
				isBuyDialogOpen,
				closeBuyDialog,
			}}
		>
			{children}
		</CreditsContext.Provider>
	);
}

export function useCreditsContext() {
	const ctx = useContext(CreditsContext);
	if (!ctx) {
		throw new Error("useCreditsContext must be used within CreditsProvider");
	}
	return ctx;
}
