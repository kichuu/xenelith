import { AppHeader } from "@/components/app-header";
import { BuyCreditsDialog } from "@/components/buy-credits-dialog";
import { CreditsProvider } from "@/components/credits-provider";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<CreditsProvider>
			<div className="grid h-svh grid-rows-[auto_1fr] bg-ef-bg-deep text-ef-text-primary">
				<AppHeader />
				<main className="overflow-y-auto">{children}</main>
			</div>
			<BuyCreditsDialog />
		</CreditsProvider>
	);
}
