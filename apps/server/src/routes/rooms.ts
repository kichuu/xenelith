import prisma from "@interior-design-ai/db";
import { Router, type Router as RouterType } from "express";
import { validate } from "../lib/validate.js";
import { createRoomSchema, updateRoomSchema } from "./houses.schema.js";

const router: RouterType = Router({ mergeParams: true });

// GET /api/v1/houses/:houseId/rooms
router.get("/", async (req, res) => {
	const { houseId } = req.params as unknown as { houseId: string };
	const house = await prisma.house.findFirst({
		where: { id: houseId, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	const rooms = await prisma.room.findMany({
		where: { houseId },
		orderBy: { createdAt: "asc" },
	});

	res.json({ rooms });
});

// POST /api/v1/houses/:houseId/rooms
router.post("/", validate(createRoomSchema), async (req, res) => {
	const { houseId } = req.params as unknown as { houseId: string };
	const house = await prisma.house.findFirst({
		where: { id: houseId, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	const room = await prisma.room.create({
		data: {
			...req.body,
			houseId,
		},
	});

	res.status(201).json({ room });
});

// PATCH /api/v1/houses/:houseId/rooms/:roomId
router.patch("/:roomId", validate(updateRoomSchema), async (req, res) => {
	const { houseId } = req.params as unknown as { houseId: string };
	const roomId = req.params.roomId as string;

	const house = await prisma.house.findFirst({
		where: { id: houseId, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	const existing = await prisma.room.findFirst({
		where: { id: roomId, houseId },
		select: { id: true },
	});

	if (!existing) {
		res.status(404).json({ error: "Room not found" });
		return;
	}

	const room = await prisma.room.update({
		where: { id: roomId },
		data: req.body,
	});

	res.json({ room });
});

// DELETE /api/v1/houses/:houseId/rooms/:roomId
router.delete("/:roomId", async (req, res) => {
	const { houseId } = req.params as unknown as { houseId: string };
	const roomId = req.params.roomId as string;

	const house = await prisma.house.findFirst({
		where: { id: houseId, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	const existing = await prisma.room.findFirst({
		where: { id: roomId, houseId },
		select: { id: true },
	});

	if (!existing) {
		res.status(404).json({ error: "Room not found" });
		return;
	}

	await prisma.room.delete({ where: { id: roomId } });
	res.status(204).end();
});

export default router;
