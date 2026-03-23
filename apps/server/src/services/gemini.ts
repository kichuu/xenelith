import { GoogleGenAI } from "@google/genai";
import { env } from "@interior-design-ai/env/server";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const FOCUS_AREAS = [
	{
		suffix:
			"Wide-angle overview showing the full room layout and architectural details.",
		category: "OVERVIEW",
	},
	{
		suffix: "Close-up focus on textiles, fabrics, and soft furnishings.",
		category: "TEXTILE FOCUS",
	},
	{
		suffix:
			"Emphasis on lighting fixtures, natural light sources, and shadow play.",
		category: "LIGHTING DETAIL",
	},
	{
		suffix: "Focus on spatial flow, furniture arrangement, and proportions.",
		category: "SPATIAL FLOW",
	},
] as const;

export interface GeneratedImageData {
	buffer: Buffer;
	category: string;
	index: number;
}

export async function generateImages(
	prompt: string,
): Promise<GeneratedImageData[]> {
	const results: GeneratedImageData[] = [];

	for (const [i, focus] of FOCUS_AREAS.entries()) {
		const fullPrompt = `${prompt} ${focus.suffix}`;

		const response = await ai.models.generateImages({
			model: "imagen-4.0-fast-generate-001",
			prompt: fullPrompt,
			config: {
				numberOfImages: 1,
			},
		});

		if (response.generatedImages) {
			for (const image of response.generatedImages) {
				if (image.image?.imageBytes) {
					results.push({
						buffer: Buffer.from(image.image.imageBytes, "base64"),
						category: focus.category,
						index: i,
					});
				}
			}
		}
	}

	return results;
}
