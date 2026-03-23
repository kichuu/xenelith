import prisma from "@interior-design-ai/db";
import { Router, type Router as RouterType } from "express";
import { validate } from "../lib/validate.js";
import { generateImages } from "../services/gemini.js";
import { uploadImage } from "../services/image-storage.js";
import { buildRefinedPrompt } from "../services/prompt-builder.js";
import { generateSchema } from "./houses.schema.js";

const router: RouterType = Router({ mergeParams: true });

async function updateProgress(
	generationId: string,
	progress: number,
	statusText: string,
) {
	await prisma.generation.update({
		where: { id: generationId },
		data: { progress, statusText },
	});
}

async function processGeneration(generationId: string) {
	try {
		await prisma.generation.update({
			where: { id: generationId },
			data: { status: "PROCESSING", startedAt: new Date() },
		});

		await updateProgress(generationId, 5, "INITIALIZING DNA CORE...");

		const generation = await prisma.generation.findUniqueOrThrow({
			where: { id: generationId },
			include: { house: true, room: true },
		});

		await updateProgress(generationId, 15, "PARSING ARCHITECTURAL GENOME...");

		await updateProgress(
			generationId,
			30,
			"REFINING PROMPT VIA NEURAL SYNTHESIS...",
		);
		const { prompt, description } = await buildRefinedPrompt(
			generation.house,
			generation.room,
		);

		await prisma.generation.update({
			where: { id: generationId },
			data: { prompt, description },
		});

		await updateProgress(generationId, 45, "SYNTHESIZING MATERIAL PROFILES...");
		const images = await generateImages(prompt);

		await updateProgress(generationId, 65, "CALIBRATING LIGHTING PROFILES...");

		await updateProgress(generationId, 80, "UPLOADING TO ARCHIVE...");
		for (const image of images) {
			const { url, width, height } = await uploadImage(
				generationId,
				image.index,
				image.buffer,
			);

			await prisma.generatedImage.create({
				data: {
					generationId,
					url,
					width,
					height,
					category: image.category,
					sortOrder: image.index,
				},
			});
		}

		await updateProgress(generationId, 90, "FINALIZING SYNTHESIS...");

		// Update house description with latest generation
		await prisma.house.update({
			where: { id: generation.houseId },
			data: { description },
		});

		await prisma.generation.update({
			where: { id: generationId },
			data: {
				status: "COMPLETED",
				progress: 100,
				statusText: "SYNTHESIS COMPLETE",
				completedAt: new Date(),
			},
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		await prisma.generation.update({
			where: { id: generationId },
			data: {
				status: "FAILED",
				statusText: "SYNTHESIS FAILED",
				errorMessage: message,
				completedAt: new Date(),
			},
		});
	}
}

// POST /api/v1/houses/:houseId/generate - Trigger generation
router.post("/generate", validate(generateSchema), async (req, res) => {
	const { houseId } = req.params as unknown as { houseId: string };
	const house = await prisma.house.findFirst({
		where: { id: houseId, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	if (req.body.roomId) {
		const room = await prisma.room.findFirst({
			where: { id: req.body.roomId as string, houseId },
			select: { id: true },
		});
		if (!room) {
			res.status(404).json({ error: "Room not found" });
			return;
		}
	}

	// Atomic credit deduction + generation creation
	const roomId = (req.body.roomId as string) || null;
	const userId = req.userProfile!.id;

	try {
		const result = await prisma.$transaction(async (tx) => {
			const profile = await tx.userProfile.findUniqueOrThrow({
				where: { id: userId },
				select: { creditBalance: true },
			});

			if (profile.creditBalance < 1) {
				throw new Error("INSUFFICIENT_CREDITS");
			}

			const updatedProfile = await tx.userProfile.update({
				where: { id: userId },
				data: { creditBalance: { decrement: 1 } },
				select: { creditBalance: true },
			});

			// Guard against race conditions
			if (updatedProfile.creditBalance < 0) {
				throw new Error("INSUFFICIENT_CREDITS");
			}

			const generation = await tx.generation.create({
				data: { houseId, roomId },
			});

			await tx.creditTransaction.create({
				data: {
					userId,
					type: "GENERATION_DEBIT",
					amount: -1,
					balanceAfter: updatedProfile.creditBalance,
					generationId: generation.id,
				},
			});

			return generation;
		});

		// Fire and forget - async processing
		processGeneration(result.id);

		res.status(202).json({ generation: result });
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "INSUFFICIENT_CREDITS"
		) {
			res.status(402).json({
				error: "Insufficient credits",
				code: "INSUFFICIENT_CREDITS",
			});
			return;
		}
		throw error;
	}
});

// GET /api/v1/houses/:houseId/generations - Generation history
router.get("/generations", async (req, res) => {
	const { houseId } = req.params as unknown as { houseId: string };
	const house = await prisma.house.findFirst({
		where: { id: houseId, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	const generations = await prisma.generation.findMany({
		where: { houseId },
		include: { images: { orderBy: { sortOrder: "asc" } } },
		orderBy: { createdAt: "desc" },
	});

	res.json({ generations });
});

// GET /api/v1/generations/:id - Poll generation status
router.get("/:id", async (req, res) => {
	const id = req.params.id as string;
	const generation = await prisma.generation.findUnique({
		where: { id },
		include: {
			images: { orderBy: { sortOrder: "asc" } },
			house: { select: { userId: true } },
		},
	});

	if (!generation || generation.house.userId !== req.userProfile!.id) {
		res.status(404).json({ error: "Generation not found" });
		return;
	}

	const { house: _, ...rest } = generation;
	res.json({ generation: rest });
});

export default router;
