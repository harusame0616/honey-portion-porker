import { test as base, type Page } from "@playwright/test";

const _test = base.extend<{ topPage: Page }>({
	topPage: async ({ page }, use) => {
		await page.goto("/");
		await use(page);
	},
});

// NOTE: 以下のテストケースはルームページのテストの過程で検証されるため実施しない
// - 新しいルームを作ってオーナールームに遷移できる
// - 作成済みのルームのオーナールームに参加できる
// - 作成済みのルームにメンバーとして参加できる
