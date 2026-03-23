import { z } from "zod";

export const createHouseSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	architecturalStyle: z.string().max(50).optional(),
	era: z.string().max(50).optional(),
	spatialDimensions: z.string().max(50).optional(),
	spatialLayout: z.string().max(100).nullish(),
	formComplexity: z.number().int().min(0).max(100).optional(),
	thermalOutput: z.number().int().min(0).max(100).optional(),
	lightingExposure: z.number().int().min(0).max(100).optional(),
	primaryMaterial: z.string().max(50).nullish(),
	secondaryMaterial: z.string().max(50).nullish(),
	colorPalette: z.string().max(100).nullish(),
	texture: z.string().max(50).nullish(),
	patternStyle: z.string().max(50).nullish(),
	mood: z.string().max(50).nullish(),
	soundDna: z.string().max(100).nullish(),
});

export const updateHouseSchema = createHouseSchema.partial();

const roomTypeEnum = z.enum([
	"LIVING_ROOM",
	"BEDROOM",
	"MASTER_BEDROOM",
	"CHILDREN_ROOM",
	"BATHROOM",
	"KITCHEN",
	"DINING_ROOM",
	"HOME_OFFICE",
	"HALLWAY",
	"BALCONY",
	"GARAGE",
	"OTHER",
]);

export const createRoomSchema = z.object({
	name: z.string().min(1).max(100),
	roomType: roomTypeEnum,
	architecturalStyle: z.string().max(50).nullish(),
	era: z.string().max(50).nullish(),
	spatialDimensions: z.string().max(50).nullish(),
	spatialLayout: z.string().max(100).nullish(),
	formComplexity: z.number().int().min(0).max(100).nullish(),
	thermalOutput: z.number().int().min(0).max(100).nullish(),
	lightingExposure: z.number().int().min(0).max(100).nullish(),
	primaryMaterial: z.string().max(50).nullish(),
	secondaryMaterial: z.string().max(50).nullish(),
	colorPalette: z.string().max(100).nullish(),
	texture: z.string().max(50).nullish(),
	patternStyle: z.string().max(50).nullish(),
	mood: z.string().max(50).nullish(),
	soundDna: z.string().max(100).nullish(),
});

export const updateRoomSchema = createRoomSchema
	.partial()
	.omit({ roomType: true });

export const generateSchema = z.object({
	roomId: z.string().optional(),
});
