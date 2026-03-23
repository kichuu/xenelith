import prisma from "@interior-design-ai/db";

export async function generateDnaCode(): Promise<string> {
	const lastHouse = await prisma.house.findFirst({
		orderBy: { createdAt: "desc" },
		select: { dnaCode: true },
	});

	let nextNumber = 1;
	if (lastHouse?.dnaCode) {
		const match = lastHouse.dnaCode.match(/DNA-(\d+)/);
		if (match?.[1]) {
			nextNumber = Number.parseInt(match[1], 10) + 1;
		}
	}

	return `DNA-${String(nextNumber).padStart(3, "0")}`;
}
