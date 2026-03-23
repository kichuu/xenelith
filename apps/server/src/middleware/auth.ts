import { getAuth } from "@clerk/express";
import prisma from "@interior-design-ai/db";
import type { NextFunction, Request, Response } from "express";

declare global {
	namespace Express {
		interface Request {
			userProfile?: {
				id: string;
				clerkId: string;
			};
		}
	}
}

export async function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { userId } = getAuth(req);

	if (!userId) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	let userProfile = await prisma.userProfile.findUnique({
		where: { clerkId: userId },
		select: { id: true, clerkId: true },
	});

	if (!userProfile) {
		userProfile = await prisma.userProfile.create({
			data: { clerkId: userId },
			select: { id: true, clerkId: true },
		});
	}

	req.userProfile = userProfile;
	next();
}
