import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PLANS = [
	{
		id: "plan_5",
		credits: 5,
		price: 50,
		label: "Starter",
		perCredit: "₹10/credit",
		description: "Perfect for trying out the platform",
	},
	{
		id: "plan_12",
		credits: 12,
		price: 100,
		label: "Popular",
		perCredit: "₹8.3/credit",
		description: "Best for regular design exploration",
		featured: true,
	},
	{
		id: "plan_30",
		credits: 30,
		price: 200,
		label: "Best Value",
		perCredit: "₹6.7/credit",
		description: "For studios and serious designers",
	},
];

export default async function Home() {
	const { userId } = await auth();

	if (userId) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-svh bg-ef-bg-deep text-ef-text-primary">
			{/* Nav */}
			<header className="flex items-center justify-between px-8 py-5">
				<span className="font-serif text-ef-gold text-sm italic tracking-wide">
					EDITORIAL FUTURISM
				</span>
				<a
					href="/sign-in"
					className="text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-text-primary"
				>
					Sign In
				</a>
			</header>

			{/* Hero */}
			<section className="flex flex-col items-center px-6 pt-24 pb-32 text-center">
				<p className="text-[11px] text-ef-accent uppercase tracking-[0.3em]">
					AI-Powered Interior Design
				</p>
				<h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight text-ef-gold italic md:text-7xl">
					Your Architectural
					<br />
					Genome
				</h1>
				<p className="mt-6 max-w-lg text-ef-text-secondary text-sm leading-relaxed">
					Define your design DNA — style, materials, mood, lighting — and let AI
					synthesize photorealistic interiors that match your vision. Each
					generation produces 4 unique perspectives of your space.
				</p>
				<div className="mt-10 flex gap-4">
					<a
						href="/sign-up"
						className="border border-ef-accent bg-ef-accent/10 px-8 py-3 text-[11px] text-ef-accent uppercase tracking-widest transition-colors hover:bg-ef-accent/20"
					>
						Get Started
					</a>
					<a
						href="#pricing"
						className="border border-ef-border px-8 py-3 text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-text-primary hover:border-ef-text-secondary/30"
					>
						View Plans
					</a>
				</div>

				{/* Feature pills */}
				<div className="mt-16 flex flex-wrap justify-center gap-3">
					{[
						"4 Images per Generation",
						"Imagen 4 AI",
						"12+ Architectural Styles",
						"Room-Level Control",
					].map((f) => (
						<span
							key={f}
							className="border border-ef-border px-4 py-1.5 text-[10px] text-ef-text-secondary uppercase tracking-widest"
						>
							{f}
						</span>
					))}
				</div>
			</section>

			{/* Divider */}
			<div className="mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-ef-border to-transparent" />

			{/* How it works */}
			<section className="mx-auto max-w-5xl px-6 py-24">
				<p className="text-[11px] text-ef-accent uppercase tracking-[0.3em]">
					The Process
				</p>
				<h2 className="mt-3 font-serif text-3xl text-ef-gold italic">
					How It Works
				</h2>
				<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
					{[
						{
							step: "01",
							title: "Define Your DNA",
							desc: "Choose architectural style, materials, color palette, mood, and spatial parameters through our sequencer.",
						},
						{
							step: "02",
							title: "AI Synthesis",
							desc: "Our AI refines your parameters into a detailed prompt, then generates 4 photorealistic interior renders.",
						},
						{
							step: "03",
							title: "Explore & Iterate",
							desc: "Review your synthesis from multiple angles — overview, textiles, lighting, and spatial flow.",
						},
					].map((item) => (
						<div
							key={item.step}
							className="border border-ef-border bg-ef-bg-surface p-6"
						>
							<span className="font-mono text-2xl text-ef-accent/40">
								{item.step}
							</span>
							<h3 className="mt-3 text-sm text-ef-text-primary font-medium">
								{item.title}
							</h3>
							<p className="mt-2 text-xs text-ef-text-secondary leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Divider */}
			<div className="mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-ef-border to-transparent" />

			{/* Pricing */}
			<section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
				<div className="text-center">
					<p className="text-[11px] text-ef-accent uppercase tracking-[0.3em]">
						Credits
					</p>
					<h2 className="mt-3 font-serif text-3xl text-ef-gold italic">
						Choose Your Plan
					</h2>
					<p className="mx-auto mt-4 max-w-md text-ef-text-secondary text-sm">
						Each synthesis costs 1 credit and generates 4 unique interior
						renders. Purchase credits to begin designing.
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
					{PLANS.map((plan) => (
						<div
							key={plan.id}
							className={`relative flex flex-col border p-8 transition-colors ${
								plan.featured
									? "border-ef-gold/40 bg-ef-gold/5"
									: "border-ef-border bg-ef-bg-surface hover:border-ef-border/80"
							}`}
						>
							{plan.featured && (
								<span className="absolute -top-3 left-6 bg-ef-gold px-3 py-0.5 text-[10px] text-ef-bg-deep font-medium uppercase tracking-widest">
									Most Popular
								</span>
							)}
							<p className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
								{plan.label}
							</p>
							<div className="mt-4 flex items-baseline gap-1">
								<span className="font-serif text-4xl text-ef-text-primary italic">
									₹{plan.price}
								</span>
							</div>
							<p className="mt-1 font-mono text-xs text-ef-accent">
								{plan.credits} credits
							</p>
							<p className="mt-4 text-xs text-ef-text-secondary leading-relaxed">
								{plan.description}
							</p>
							<div className="mt-auto pt-6">
								<span className="mb-4 block text-[10px] text-ef-text-secondary">
									{plan.perCredit}
								</span>
								<a
									href="/sign-up"
									className={`block w-full border py-3 text-center text-[11px] uppercase tracking-widest transition-colors ${
										plan.featured
											? "border-ef-gold bg-ef-gold/10 text-ef-gold hover:bg-ef-gold/20"
											: "border-ef-accent bg-ef-accent/10 text-ef-accent hover:bg-ef-accent/20"
									}`}
								>
									Get Started
								</a>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-ef-border px-8 py-8">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<span className="font-serif text-ef-gold/60 text-xs italic">
						Editorial Futurism
					</span>
					<span className="text-[10px] text-ef-text-secondary tracking-wider">
						AI Interior Design Studio
					</span>
				</div>
			</footer>
		</div>
	);
}
