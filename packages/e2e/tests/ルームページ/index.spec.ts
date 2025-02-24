import { test as baseTest, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

const test = baseTest.extend({
	page: async ({ page }, use) => {
		await page.goto("/");
		await page.getByRole("button", { name: /^CREATE ROOM$/ }).click();
		await expect(page).toHaveTitle("オーナールーム | Honey Portion Poker");
		await use(page);
	},
});

test("存在しないページの場合 not found が表示され、表示されるフォームから存在するオーナールームに遷移できる", async ({
	page,
}) => {
	const ownerRoomId = page.url().split("/").pop() || "";
	await page.goto("/");
	await page.getByRole("textbox", { name: /^ルーム ID$/ }).fill(randomUUID());
	await page.getByRole("button", { name: /^参加$/ }).click();
	await expect(page).toHaveTitle(
		/^ルームが見つかりません | Honey Portion Poker$/,
	);

	await page.getByRole("textbox", { name: /^ルーム ID$/ }).fill(ownerRoomId);
	await page.getByRole("button", { name: /^参加$/ }).click();
	await expect(page).toHaveTitle(/^オーナールーム | Honey Portion Poker$/);
});
