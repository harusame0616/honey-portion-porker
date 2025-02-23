import { test as base, expect, type Page } from "@playwright/test";

const test = base.extend<{ topPage: Page }>({
	topPage: async ({ page }, use) => {
		await page.goto("/");
		use(page);
	},
});

test("新しいルームを作ってオーナールームに遷移できる", async ({ topPage }) => {
	await test.step("新しいルームを作成", async () => {
		await topPage.getByRole("button", { name: /^CREATE ROOM$/ }).click();
	});

	await test.step("オーナールームであることをテスト", async () => {
		await expect(topPage).toHaveTitle("オーナールーム | Honey Portion Poker");
	});
});

test("作成済みのルームのオーナールームに参加できる", async ({ topPage }) => {
	let ownerRoomId = "";
	await test.step("新しいルームを作成してオーナーズルーム ID を取得", async () => {
		await topPage.getByRole("button", { name: /^CREATE ROOM$/ }).click();
		await expect(topPage).toHaveTitle("オーナールーム | Honey Portion Poker");

		ownerRoomId = topPage.url().split("/").pop() || "";
	});

	await test.step("トップ画面からオーナールームに参加", async () => {
		await topPage.goto("/");
		await topPage
			.getByRole("textbox", { name: /^ルーム ID$/ })
			.fill(ownerRoomId);
		await topPage.getByRole("button", { name: /^参加$/ }).click();
	});

	await test.step("オーナールームであることをテスト", async () => {
		await expect(topPage).toHaveTitle("オーナールーム | Honey Portion Poker");
	});
});

test("作成済みのルームにメンバーとして参加できる", async ({ topPage }) => {
	let memberRoomId = "";
	await test.step("新しいルームを作成してメンバールーム ID を取得", async () => {
		await topPage.getByRole("button", { name: /^CREATE ROOM$/ }).click();
		memberRoomId = await topPage
			.getByRole("textbox", { name: /^Member Room ID$/ })
			.inputValue();
	});

	await test.step("トップ画面からメンバールームに参加", async () => {
		await topPage.goto("/");
		await topPage
			.getByRole("textbox", { name: /^ルーム ID$/ })
			.fill(memberRoomId);
		await topPage.getByRole("button", { name: /^参加$/ }).click();
	});

	await test.step("メンバールームであることをテスト", async () => {
		await expect(topPage).toHaveTitle("メンバールーム | Honey Portion Poker");
	});
});

test("初回表示のスナップショットテスト", async ({ topPage }, { title }) => {
	await expect(topPage).toHaveScreenshot(title, {
		fullPage: true,
		maxDiffPixelRatio: 0.02,
	});
});
