import { randomUUID } from "node:crypto";
import { test as baseTest, expect, type Page } from "@playwright/test";

const test = baseTest.extend<{ ownerPage: Page }>({
	ownerPage: async ({ page }, use) => {
		await page.goto("/");
		await page.getByRole("button", { name: /^CREATE ROOM$/ }).click();
		await expect(page).toHaveTitle("オーナールーム | Honey Portion Poker");
		await use(page);
	},
});

test("存在しないページの場合 not found が表示され、表示されるフォームから存在するオーナールームに遷移できる", async ({
	ownerPage,
}) => {
	const ownerRoomId = ownerPage.url().split("/").pop() || "";
	await ownerPage.goto("/");
	await ownerPage
		.getByRole("textbox", { name: /^ルーム ID$/ })
		.fill(randomUUID());
	await ownerPage.getByRole("button", { name: /^参加$/ }).click();
	await expect(ownerPage).toHaveTitle(
		/^ルームが見つかりません | Honey Portion Poker$/,
	);

	await ownerPage
		.getByRole("textbox", { name: /^ルーム ID$/ })
		.fill(ownerRoomId);
	await ownerPage.getByRole("button", { name: /^参加$/ }).click();
	await expect(ownerPage).toHaveTitle(/^オーナールーム | Honey Portion Poker$/);
});

test("選択したカードが反映され、手動でオープン、リセットができる", async ({
	ownerPage,
	browser,
}) => {
	let memberPage: Page;

	await test.step("メンバールームに参加", async () => {
		const memberRoomId = await ownerPage
			.getByRole("textbox", {
				name: /^Member Room ID$/,
			})
			.inputValue();

		memberPage = await browser.newPage();
		await memberPage.goto(`/rooms/${memberRoomId}`);
		await expect(memberPage).toHaveTitle(
			"メンバールーム | Honey Portion Poker",
		);
	});

	await test.step("参加人数分の Member's cards が表示されていることを確認", async () => {
		await expect(
			ownerPage.getByRole("listitem").filter({
				has: ownerPage.getByRole("img", { name: "未選択の裏向きのカード" }),
			}),
		).toHaveCount(2);
		await expect(
			memberPage.getByRole("listitem").filter({
				has: memberPage.getByRole("img", { name: "未選択の裏向きのカード" }),
			}),
		).toHaveCount(2);
	});

	await test.step("カードを選択すると自分にも他のルームにも反映される（オーナールーム）", async () => {
		await ownerPage
			.getByRole("button", { name: /^未選択の 1 のカード$/ })
			.click();

		await expect(
			ownerPage.getByRole("listitem").filter({
				has: ownerPage.getByRole("img", { name: "未選択の裏向きのカード" }),
			}),
		).toHaveCount(1);
		await expect(
			ownerPage.getByRole("listitem").filter({
				has: ownerPage.getByRole("img", { name: "選択済みの裏向きのカード" }),
			}),
		).toHaveCount(1);
		await expect(
			memberPage.getByRole("listitem").filter({
				has: memberPage.getByRole("img", { name: "未選択の裏向きのカード" }),
			}),
		).toHaveCount(1);
		// Your choices と Member's cards が「選択済みの 1 のカード」になるので 2
		await expect(
			memberPage.getByRole("listitem").filter({
				has: memberPage.getByRole("img", { name: "選択済みの裏向きのカード" }),
			}),
		).toHaveCount(1);
	});

	await test.step("カードを選択すると自分にも他のルームにも反映される（ユーザールーム）", async () => {
		await memberPage
			.getByRole("button", { name: /^未選択の 2 のカード$/ })
			.click();

		await expect(
			ownerPage.getByRole("listitem").filter({
				has: ownerPage.getByRole("img", { name: "選択済みの裏向きのカード" }),
			}),
		).toHaveCount(2);
		await expect(
			memberPage.getByRole("listitem").filter({
				has: memberPage.getByRole("img", { name: "選択済みの裏向きのカード" }),
			}),
		).toHaveCount(2);
	});

	await test.step("カードをオープンすると選択されたカードが表示される", async () => {
		await ownerPage.getByRole("button", { name: /^OPEN$$/ }).click();

		await expect(
			ownerPage
				.getByRole("listitem")
				.filter({ hasText: "選択済みの1のカード" }),
		).toHaveCount(2);
		await expect(
			ownerPage
				.getByRole("listitem")
				.filter({ hasText: "選択済みの2のカード" }),
		).toHaveCount(1);
		await expect(
			memberPage
				.getByRole("listitem")
				.filter({ hasText: "選択済みの1のカード" }),
		).toHaveCount(1);
		await expect(
			memberPage
				.getByRole("listitem")
				.filter({ hasText: "選択済みの2のカード" }),
		).toHaveCount(2);
	});

	await test.step("リセットすると選択が解除され、Member's Cards が裏返しになる", async () => {
		await ownerPage.getByRole("button", { name: /^RESET$$/ }).click();

		await expect(
			ownerPage.getByRole("listitem").filter({ hasText: "選択済み" }),
		).toHaveCount(0);
		await expect(
			ownerPage.getByRole("listitem").filter({
				has: ownerPage.getByRole("img", { name: "未選択の裏向きのカード" }),
			}),
		).toHaveCount(2);

		await expect(
			memberPage.getByRole("listitem").filter({ hasText: "選択済み" }),
		).toHaveCount(0);
		await expect(
			memberPage.getByRole("listitem").filter({
				has: memberPage.getByRole("img", { name: "未選択の裏向きのカード" }),
			}),
		).toHaveCount(2);
	});
});
