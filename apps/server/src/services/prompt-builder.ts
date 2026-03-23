import { GoogleGenAI } from "@google/genai";
import type { House, Room } from "@interior-design-ai/db/types";
import { env } from "@interior-design-ai/env/server";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

function mapSlider(
	value: number,
	low: string,
	mid: string,
	high: string,
): string {
	if (value <= 25) return low;
	if (value <= 75) return mid;
	return high;
}

function resolveField<T>(roomValue: T | null | undefined, houseValue: T): T {
	return roomValue ?? houseValue;
}

function buildSeedPrompt(house: House, room?: Room | null): string {
	const style = resolveField(
		room?.architecturalStyle,
		house.architecturalStyle,
	);
	const era = resolveField(room?.era, house.era);
	const spatial = resolveField(
		room?.spatialDimensions,
		house.spatialDimensions,
	);
	const formComplexity = resolveField(
		room?.formComplexity,
		house.formComplexity,
	);
	const thermal = resolveField(room?.thermalOutput, house.thermalOutput);
	const lighting = resolveField(room?.lightingExposure, house.lightingExposure);
	const primaryMat = resolveField(room?.primaryMaterial, house.primaryMaterial);
	const secondaryMat = resolveField(
		room?.secondaryMaterial,
		house.secondaryMaterial,
	);
	const palette = resolveField(room?.colorPalette, house.colorPalette);
	const texture = resolveField(room?.texture, house.texture);
	const mood = resolveField(room?.mood, house.mood);

	const formDesc = mapSlider(
		formComplexity,
		"extremely minimalist, clean lines, unadorned surfaces",
		"balanced complexity, curated details, purposeful ornamentation",
		"highly complex, layered forms, intricate geometric patterns, maximalist detailing",
	);
	const thermalDesc = mapSlider(
		thermal,
		"cool, airy atmosphere with stone and metal tones",
		"balanced warmth, comfortable ambient temperature through mixed materials",
		"warm, cozy atmosphere with rich wood tones and soft textiles",
	);
	const lightDesc = mapSlider(
		lighting,
		"dim, moody lighting with deep shadows and accent spotlights",
		"balanced natural and artificial lighting, soft diffused glow",
		"bright, sun-drenched space with floor-to-ceiling windows and abundant natural light",
	);

	const parts = [
		`A photorealistic interior photograph of a ${spatial.toLowerCase()}-sized ${room ? room.roomType.toLowerCase().replace(/_/g, " ") : "living space"}.`,
		`Architectural style: ${style}, ${era} era.`,
		`Form complexity: ${formDesc}.`,
		`Thermal character: ${thermalDesc}.`,
		`Lighting: ${lightDesc}.`,
	];

	if (primaryMat) parts.push(`Primary material: ${primaryMat}.`);
	if (secondaryMat) parts.push(`Secondary material: ${secondaryMat}.`);
	if (palette) parts.push(`Color palette: ${palette}.`);
	if (texture) parts.push(`Texture: ${texture}.`);
	if (mood) parts.push(`Mood: ${mood}.`);

	parts.push(
		"Shot on medium format camera, editorial interior photography, ultra-high detail, 8K resolution.",
	);

	return parts.join(" ");
}

export async function buildRefinedPrompt(
	house: House,
	room?: Room | null,
): Promise<{ prompt: string; description: string }> {
	const seedPrompt = buildSeedPrompt(house, room);

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: `You are an expert interior design prompt engineer. Given this seed description, expand it into a rich, detailed image generation prompt optimized for photorealistic interior rendering. Add specific details about composition, materials, furniture placement, and atmosphere. Keep it as one paragraph, max 300 words.

Also provide a separate 2-sentence description of the design for display purposes.

Seed: ${seedPrompt}

Respond in this exact JSON format:
{"prompt": "the expanded prompt here", "description": "the 2-sentence description here"}`,
	});

	const text = response.text ?? "";

	try {
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);
			return {
				prompt: parsed.prompt || seedPrompt,
				description: parsed.description || "",
			};
		}
	} catch {
		// Fall back to seed prompt if parsing fails
	}

	return { prompt: seedPrompt, description: "" };
}
