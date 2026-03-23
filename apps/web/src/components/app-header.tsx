"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCreditsContext } from "@/components/credits-provider";

export function AppHeader() {
	const { balance, loading, openBuyDialog } = useCreditsContext();

	return (
		<header className="flex items-center justify-between border-ef-border border-b px-6 py-3">
			<Link href="/dashboard" className="flex items-center gap-3">
				<span className="font-serif text-ef-gold text-sm italic tracking-wide">
					EDITORIAL FUTURISM
				</span>
			</Link>
			<div className="flex items-center gap-4">
				<nav className="flex gap-4">
					<Link
						href="/dashboard"
						className="text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-text-primary"
					>
						Foyer
					</Link>
					<Link
						href="/sequencer/new"
						className="text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-accent"
					>
						Sequencer
					</Link>
				</nav>
				<button
					type="button"
					onClick={openBuyDialog}
					className="flex items-center gap-1.5 border border-ef-gold/30 bg-ef-gold/5 px-3 py-1 transition-colors hover:border-ef-gold/50 hover:bg-ef-gold/10"
				>
					<span className="text-[11px] font-medium text-ef-gold tabular-nums">
						{loading ? "—" : balance}
					</span>
					<span className="text-[9px] text-ef-gold-dim uppercase tracking-widest">
						Credits
					</span>
				</button>
				<UserButton
					appearance={{
						elements: {
							avatarBox: "size-7",
						},
					}}
				/>
			</div>
		</header>
	);
}
