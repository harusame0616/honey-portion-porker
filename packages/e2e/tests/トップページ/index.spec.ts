import { test as base, expect, type Page } from "@playwright/test";

const test = base.extend<{ topPage: Page }>({
	topPage: async ({ page }, use) => {
		await page.goto("/");
		await use(page);
	},
});

// NOTE: 以下のテストケースはルームページのテストの過程で検証されるため実施しない
// - 新しいルームを作ってオーナールームに遷移できる
// - 作成済みのルームのオーナールームに参加できる
// - 作成済みのルームにメンバーとして参加できる

test("初回表示のスナップショットテスト", async ({ topPage }, { title }) => {
	test.skip(!!process.env.CI, "CI 環境ではスナップショットテストをスキップ");
	await expect(topPage).toHaveScreenshot(title, {
		fullPage: true,
		maxDiffPixelRatio: 0.02,
	});
});
