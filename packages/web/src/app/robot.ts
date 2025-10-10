import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			allow: "/",
			disallow: "/rooms/",
			userAgent: "*",
		},
		sitemap: `https://${process.env.VERCEL_URL}/sitemap.xml`,
	};
}
