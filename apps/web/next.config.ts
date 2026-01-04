import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	cacheComponents: true,
	cacheLife: {
		permanent: {
			stale: 60 * 60 * 24 * 365, // 1年
			revalidate: 60 * 60 * 24 * 365,
			expire: 60 * 60 * 24 * 365,
		},
	},
};

export default nextConfig;
