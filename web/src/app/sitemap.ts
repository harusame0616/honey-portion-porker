import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${process.env.VERCEL_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily", // TODO: トップが安定するまで daily。安定したら yearly に変更する
      priority: 1,
    },
  ];
}
