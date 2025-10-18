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

test("存在しないルームページからの復帰", async ({
	ownerPage,
	browser,
}) => {
	const ownerRoomId = ownerPage.url().split("/").pop() || "";
	let newPage: Page;

	await test.step("新しいページで存在しないルームに遷移", async () => {
		newPage = await browser.newPage();
		await newPage.goto("/");
		await newPage
			.getByRole("textbox", { name: /^ルーム ID$/ })
			.fill(randomUUID());
		await newPage.getByRole("button", { name: /^参加$/ }).click();
	});

	await test.step("「ルームが見つかりません」が表示されることを確認", async () => {
		await expect(newPage).toHaveTitle(
			/^ルームが見つかりません | Honey Portion Poker$/,
		);
	});

	await test.step("遷移フォームが表示され存在するオーナールームに遷移できることを確認", async () => {
		await newPage
			.getByRole("textbox", { name: /^ルーム ID$/ })
			.fill(ownerRoomId);
		await newPage.getByRole("button", { name: /^参加$/ }).click();
	});

	await test.step("オーナールームに遷移できることを確認", async () => {
		await expect(newPage).toHaveTitle(/^オーナールーム | Honey Portion Poker$/);
		await newPage.close();
	});
});

test("カードの選択、オープン、リセット", async ({
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


test("Auto Reset ON時の自動リセットと設定の永続化", async ({
	ownerPage,
	browser,
}) => {
	let memberPage: Page;
	const ownerRoomId = ownerPage.url().split("/").pop() || "";

	await test.step("初期状態で Auto Reset がOFFであることを確認", async () => {
		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await expect(autoResetCheckbox).not.toBeChecked();
	});

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

	await test.step("Auto Reset チェックボックスをONにする", async () => {
		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await autoResetCheckbox.check();
		await expect(autoResetCheckbox).toBeChecked();
	});

	await test.step("両方のユーザーがカードを選択", async () => {
		await ownerPage
			.getByRole("button", { name: /^未選択の 1 のカード$/ })
			.click();
		await memberPage
			.getByRole("button", { name: /^未選択の 2 のカード$/ })
			.click();
	});

	await test.step("カードをOPEN", async () => {
		await ownerPage.getByRole("button", { name: /^OPEN$/ }).click();

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
	});

	await test.step("clock mockで1分進める", async () => {
		await ownerPage.clock.install();
		await memberPage.clock.install();
		await ownerPage.clock.fastForward(60000);
		await memberPage.clock.fastForward(60000);
	});

	await test.step("両ルームでカードが自動的にリセットされることを確認", async () => {
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

	await memberPage.close();

	await test.step("ページをリロードしてAuto Reset設定が保持されることを確認", async () => {
		await ownerPage.reload();
		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await expect(autoResetCheckbox).toBeChecked();
	});

	await test.step("別のページから同じルームにアクセスしてAuto Reset設定が保持されることを確認", async () => {
		await ownerPage.goto("/");
		await ownerPage
			.getByRole("textbox", { name: /^ルーム ID$/ })
			.fill(ownerRoomId);
		await ownerPage.getByRole("button", { name: /^参加$/ }).click();
		await expect(ownerPage).toHaveTitle(/^オーナールーム | Honey Portion Poker$/);

		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await expect(autoResetCheckbox).toBeChecked();
	});
});

test("Auto Reset OFF時は自動リセットされない", async ({
	ownerPage,
	browser,
}) => {
	let memberPage: Page;

	await test.step("初期状態で Auto Reset がOFFであることを確認", async () => {
		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await expect(autoResetCheckbox).not.toBeChecked();
	});


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

	await test.step("両方のユーザーがカードを選択", async () => {
		await ownerPage
			.getByRole("button", { name: /^未選択の 1 のカード$/ })
			.click();
		await memberPage
			.getByRole("button", { name: /^未選択の 2 のカード$/ })
			.click();
	});

	await test.step("カードをOPEN", async () => {
		await ownerPage.getByRole("button", { name: /^OPEN$/ }).click();

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
	});

	await test.step("clock mockで1分以上進める", async () => {
		await ownerPage.clock.install();
		await memberPage.clock.install();
		await ownerPage.clock.fastForward(70000);
		await memberPage.clock.fastForward(70000);
	});

	await test.step("カードがリセットされないことを確認", async () => {
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

	await memberPage.close();
});

test("Auto Reset ON時でもOPEN前は自動リセットされない", async ({
	ownerPage,
	browser,
}) => {
	let memberPage: Page;

	await test.step("初期状態で Auto Reset がOFFであることを確認", async () => {
		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await expect(autoResetCheckbox).not.toBeChecked();
	});

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

	await test.step("Auto Reset チェックボックスをONにする", async () => {
		const autoResetCheckbox = ownerPage.getByLabel("Auto Reset");
		await autoResetCheckbox.check();
		await expect(autoResetCheckbox).toBeChecked();
	});

	await test.step("ユーザーがカードを選択（OPENはしない）", async () => {
		await ownerPage
			.getByRole("button", { name: /^未選択の 1 のカード$/ })
			.click();
		await memberPage
			.getByRole("button", { name: /^未選択の 2 のカード$/ })
			.click();
	});

	await test.step("clock mockで1分以上進める", async () => {
		await ownerPage.clock.install();
		await memberPage.clock.install();
		await ownerPage.clock.fastForward(70000);
		await memberPage.clock.fastForward(70000);
	});

	await test.step("カードの選択状態が維持されることを確認（裏向きのまま）", async () => {
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
		await expect(
			memberPage.getByRole("listitem").filter({
				has: memberPage.getByRole("img", { name: "選択済みの裏向きのカード" }),
			}),
		).toHaveCount(1);
	});

	await memberPage.close();
});

test("Auto Open ON時の自動オープンと設定の永続化", async ({
	ownerPage,
	browser,
}) => {
	let memberPage: Page;
	const ownerRoomId = ownerPage.url().split("/").pop() || "";

	await test.step("初期状態で Auto Open がOFFであることを確認", async () => {
		const autoOpenCheckbox = ownerPage.getByLabel("Auto Open");
		await expect(autoOpenCheckbox).not.toBeChecked();
	});

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

	await test.step("Auto Open チェックボックスをONにする", async () => {
		const autoOpenCheckbox = ownerPage.getByLabel("Auto Open");
		await autoOpenCheckbox.check();
		await expect(autoOpenCheckbox).toBeChecked();
	});

	await test.step("1人目がカードを選択（まだオープンしない）", async () => {
		await ownerPage
			.getByRole("button", { name: /^未選択の 1 のカード$/ })
			.click();

		// まだオープンしていないことを確認
		await expect(
			ownerPage.getByRole("listitem").filter({ hasText: "選択済みの1のカード" }),
		).toHaveCount(0);
	});

	await test.step("2人目がカードを選択すると自動的にオープンされる", async () => {
		await memberPage
			.getByRole("button", { name: /^未選択の 2 のカード$/ })
			.click();

		// 自動的にオープンされることを確認
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

	await memberPage.close();

	await test.step("ページをリロードしてAuto Open設定が保持されることを確認", async () => {
		await ownerPage.reload();
		const autoOpenCheckbox = ownerPage.getByLabel("Auto Open");
		await expect(autoOpenCheckbox).toBeChecked();
	});

	await test.step("別のページから同じルームにアクセスしてAuto Open設定が保持されることを確認", async () => {
		await ownerPage.goto("/");
		await ownerPage
			.getByRole("textbox", { name: /^ルーム ID$/ })
			.fill(ownerRoomId);
		await ownerPage.getByRole("button", { name: /^参加$/ }).click();
		await expect(ownerPage).toHaveTitle(/^オーナールーム | Honey Portion Poker$/);

		const autoOpenCheckbox = ownerPage.getByLabel("Auto Open");
		await expect(autoOpenCheckbox).toBeChecked();
	});
});

test("Auto Open OFF時は自動オープンされない", async ({
	ownerPage,
	browser,
}) => {
	let memberPage: Page;

	await test.step("初期状態で Auto Open がOFFであることを確認", async () => {
		const autoOpenCheckbox = ownerPage.getByLabel("Auto Open");
		await expect(autoOpenCheckbox).not.toBeChecked();
	});

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

	await test.step("両方のユーザーがカードを選択", async () => {
		await ownerPage
			.getByRole("button", { name: /^未選択の 1 のカード$/ })
			.click();
		await memberPage
			.getByRole("button", { name: /^未選択の 2 のカード$/ })
			.click();
	});

	await test.step("全員が選択してもAuto OpenがOFFなので自動オープンされないことを確認", async () => {
		// まだオープンしていないことを確認（選択済みだが表示されない）
		await expect(
			ownerPage.getByRole("listitem").filter({ hasText: "選択済みの1のカード" }),
		).toHaveCount(0);
		await expect(
			ownerPage.getByRole("listitem").filter({ hasText: "選択済みの2のカード" }),
		).toHaveCount(0);

		await expect(
			memberPage.getByRole("listitem").filter({ hasText: "選択済みの1のカード" }),
		).toHaveCount(0);
		await expect(
			memberPage.getByRole("listitem").filter({ hasText: "選択済みの2のカード" }),
		).toHaveCount(0);

		// 裏向きのカードが表示されていることを確認
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

	await memberPage.close();
});
