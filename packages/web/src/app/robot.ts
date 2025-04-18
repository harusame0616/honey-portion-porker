import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/rooms/",
		},
		sitemap: `https://${process.env.VERCEL_URL}/sitemap.xml`,
	};
}
