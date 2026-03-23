import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@interior-design-ai/env/server";
import sharp from "sharp";

const s3 = new S3Client({
	region: "auto",
	endpoint: env.R2_ENDPOINT,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

export async function uploadImage(
	generationId: string,
	index: number,
	imageBuffer: Buffer,
): Promise<{ url: string; width: number; height: number }> {
	const webpBuffer = await sharp(imageBuffer).webp({ quality: 85 }).toBuffer();

	const metadata = await sharp(webpBuffer).metadata();

	const key = `generations/${generationId}/${index}.webp`;

	await s3.send(
		new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
			Body: webpBuffer,
			ContentType: "image/webp",
		}),
	);

	return {
		url: `${env.R2_PUBLIC_URL}/${key}`,
		width: metadata.width ?? 0,
		height: metadata.height ?? 0,
	};
}
