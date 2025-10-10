import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	expect: {
		toHaveScreenshot: {
			pathTemplate:
				"{testDir}/{testFileDir}/screenshots/{arg}/{projectName}.png",
		},
	},
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Run tests in files in parallel */
	fullyParallel: true,

	/* Configure projects for major browsers */
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: "pnpm --filter web build && pnpm --filter web start",
		reuseExistingServer: !process.env.CI,
		url: "http://127.0.0.1:3000",
	},
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
});
