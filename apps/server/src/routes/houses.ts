import prisma from "@interior-design-ai/db";
import { Router, type Router as RouterType } from "express";
import { generateDnaCode } from "../lib/dna-code.js";
import { validate } from "../lib/validate.js";
import { createHouseSchema, updateHouseSchema } from "./houses.schema.js";

const router: RouterType = Router();

// GET /api/v1/houses - List user's houses
router.get("/", async (req, res) => {
	const houses = await prisma.house.findMany({
		where: { userId: req.userProfile!.id },
		include: {
			rooms: { select: { id: true, name: true, roomType: true } },
			generations: {
				where: { status: "COMPLETED" },
				orderBy: { createdAt: "desc" },
				take: 1,
				include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
			},
		},
		orderBy: { updatedAt: "desc" },
	});

	res.json({ houses });
});

// POST /api/v1/houses - Create house
router.post("/", validate(createHouseSchema), async (req, res) => {
	const dnaCode = await generateDnaCode();

	const house = await prisma.house.create({
		data: {
			...req.body,
			dnaCode,
			userId: req.userProfile!.id,
		},
	});

	res.status(201).json({ house });
});

// GET /api/v1/houses/:id - House detail
router.get("/:id", async (req, res) => {
	const id = req.params.id as string;
	const house = await prisma.house.findFirst({
		where: { id, userId: req.userProfile!.id },
		include: {
			rooms: true,
			generations: {
				orderBy: { createdAt: "desc" },
				take: 1,
				include: { images: { orderBy: { sortOrder: "asc" } } },
			},
		},
	});

	if (!house) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	res.json({ house });
});

// PATCH /api/v1/houses/:id - Update house
router.patch("/:id", validate(updateHouseSchema), async (req, res) => {
	const id = req.params.id as string;
	const existing = await prisma.house.findFirst({
		where: { id, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!existing) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	const house = await prisma.house.update({
		where: { id },
		data: req.body,
	});

	res.json({ house });
});

// DELETE /api/v1/houses/:id - Delete house
router.delete("/:id", async (req, res) => {
	const id = req.params.id as string;
	const existing = await prisma.house.findFirst({
		where: { id, userId: req.userProfile!.id },
		select: { id: true },
	});

	if (!existing) {
		res.status(404).json({ error: "House not found" });
		return;
	}

	await prisma.house.delete({ where: { id } });
	res.status(204).end();
});

export default router;
