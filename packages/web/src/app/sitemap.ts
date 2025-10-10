import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			changeFrequency: "daily", // TODO: トップが安定するまで daily。安定したら yearly に変更する
			lastModified: new Date(),
			priority: 1,
			url: `https://${process.env.VERCEL_URL}`,
		},
	];
}
