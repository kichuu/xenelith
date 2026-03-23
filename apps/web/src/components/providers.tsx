"use client";

import { useAuth } from "@clerk/nextjs";
import { Toaster } from "@interior-design-ai/ui/components/sonner";

import { setTokenGetter } from "@/lib/api-client";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	const { getToken } = useAuth();

	// Set synchronously so it's available before any child useEffect API calls
	setTokenGetter(getToken);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
}
