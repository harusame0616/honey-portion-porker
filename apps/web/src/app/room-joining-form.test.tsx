import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { test as baseTest, expect, vi } from "vitest";
import { JoinRoomForm } from "./room-joining-form";

// モックの準備
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

const test = baseTest.extend<{
	user: ReturnType<typeof userEvent.setup>;
	mockPush: ReturnType<typeof vi.fn<(url: string) => void>>;
}>({
	// biome-ignore lint/correctness/noEmptyPattern: Vitest fixtures require object destructuring
	mockPush: async ({}, use) => {
		const mockPush = vi.fn<(url: string) => void>();
		vi.mocked(useRouter).mockReturnValue({
			push: mockPush,
		} as ReturnType<typeof useRouter>);
		await use(mockPush);
		mockPush.mockClear();
	},
	// biome-ignore lint/correctness/noEmptyPattern: Vitest fixtures require object destructuring
	user: async ({}, use) => {
		await use(userEvent.setup());
	},
});

// 基本レンダリング
test("フォームが正しくレンダリングされること", () => {
	render(<JoinRoomForm />);

	// フォームが存在することを確認
	const form = screen.getByRole("form");
	expect(form).toBeInTheDocument();
});

test("入力フィールドとボタンが表示されること", () => {
	render(<JoinRoomForm />);

	// 入力フィールドが表示されていることを確認
	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	expect(input).toBeInTheDocument();

	// 参加ボタンが表示されていることを確認
	const submitButton = screen.getByRole("button", { name: "参加" });
	expect(submitButton).toBeInTheDocument();
});

test("ラベルが適切に表示されること", () => {
	render(<JoinRoomForm />);

	// ラベルが表示されていることを確認
	const label = screen.getByText("ルーム ID");
	expect(label).toBeInTheDocument();
});

// フォーム送信時の動作
test("有効なルーム ID で送信すると、適切な処理が実行されること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	// 有効な UUID を入力
	const validUuid = "550e8400-e29b-41d4-a716-446655440000";
	await user.click(input);
	await user.paste(validUuid);

	// フォームを送信
	await user.click(submitButton);

	// ルーターのpushが呼ばれることを確認
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith(`/rooms/${validUuid}`);
	});
});

test("送信成功時にページ遷移が行われること", async ({ user, mockPush }) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	const validUuid = "123e4567-e89b-12d3-a456-426614174000";
	await user.click(input);
	await user.paste(validUuid);

	await user.click(submitButton);

	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith(`/rooms/${validUuid}`);
	});
});

test("送信中は再送信できないこと", async ({ user, mockPush }) => {
	// router.pushを遅延させる
	let resolvePush!: () => void;
	const pushPromise = new Promise<void>((resolve) => {
		resolvePush = resolve;
	});

	mockPush.mockImplementation(() => {
		pushPromise.then(() => {});
		return undefined as never;
	});

	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	const validUuid = "550e8400-e29b-41d4-a716-446655440000";
	await user.click(input);
	await user.paste(validUuid);

	// 最初の送信
	await user.click(submitButton);

	// 送信中はボタンが無効化されることを確認
	await waitFor(() => {
		expect(submitButton).toBeDisabled();
	});

	// 遅延を解決
	resolvePush();
});

// バリデーションエラーの表示
test("空欄で送信するとバリデーションエラーが表示されること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const submitButton = screen.getByRole("button", { name: "参加" });

	// 何も入力せずに送信
	await user.click(submitButton);

	// エラーメッセージが表示されることを確認
	expect(
		await screen.findByText("ルーム ID を入力してください。"),
	).toBeInTheDocument();

	// router.pushが呼ばれないことを確認
	expect(mockPush).not.toHaveBeenCalled();
});

test("エラーメッセージ「ルーム ID を入力してください。」が表示されること", async ({
	user,
}) => {
	render(<JoinRoomForm />);

	const submitButton = screen.getByRole("button", { name: "参加" });
	await user.click(submitButton);

	const errorMessage = await screen.findByText(
		"ルーム ID を入力してください。",
	);
	expect(errorMessage).toBeInTheDocument();
});

test("UUID 形式でない値を入力するとバリデーションエラーが表示されること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	// 無効な値を入力
	await user.click(input);
	await user.paste("invalid-uuid");

	// フォームを送信
	await user.click(submitButton);

	// エラーメッセージが表示されることを確認
	expect(
		await screen.findByText("ルーム ID は UUID 形式で入力してください。"),
	).toBeInTheDocument();

	// router.pushが呼ばれないことを確認
	expect(mockPush).not.toHaveBeenCalled();
});

test("エラーメッセージ「ルーム ID は UUID 形式で入力してください。」が表示されること", async ({
	user,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	await user.click(input);
	await user.paste("not-a-uuid");
	await user.click(submitButton);

	const errorMessage = await screen.findByText(
		"ルーム ID は UUID 形式で入力してください。",
	);
	expect(errorMessage).toBeInTheDocument();
});

// UUID 形式のバリデーション
test("有効な UUID (例: 550e8400-e29b-41d4-a716-446655440000) が受け入れられること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	const validUuid = "550e8400-e29b-41d4-a716-446655440000";
	await user.click(input);
	await user.paste(validUuid);
	await user.click(submitButton);

	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith(`/rooms/${validUuid}`);
	});
});

test("無効な UUID (例: invalid-uuid) が拒否されること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	await user.click(input);
	await user.paste("invalid-uuid");
	await user.click(submitButton);

	expect(
		await screen.findByText("ルーム ID は UUID 形式で入力してください。"),
	).toBeInTheDocument();
	expect(mockPush).not.toHaveBeenCalled();
});

test("ハイフンなしの UUID が拒否されること", async ({ user, mockPush }) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	// ハイフンなしの UUID
	await user.click(input);
	await user.paste("550e8400e29b41d4a716446655440000");
	await user.click(submitButton);

	expect(
		await screen.findByText("ルーム ID は UUID 形式で入力してください。"),
	).toBeInTheDocument();
	expect(mockPush).not.toHaveBeenCalled();
});

test("大文字小文字が適切に処理されること", async ({ user, mockPush }) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	// 大文字の UUID
	const uppercaseUuid = "550E8400-E29B-41D4-A716-446655440000";
	await user.click(input);
	await user.paste(uppercaseUuid);
	await user.click(submitButton);

	// UUID は大文字でも受け入れられる
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith(`/rooms/${uppercaseUuid}`);
	});
});

// アクセシビリティ
test("入力フィールドに適切な aria-label が設定されていること", () => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	expect(input).toBeInTheDocument();
});

test("バリデーションエラー時に aria-invalid が設定されること", async ({
	user,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	// 無効な値を入力して送信
	await user.click(input);
	await user.paste("invalid");
	await user.click(submitButton);

	// エラーが表示されるまで待つ
	await screen.findByText("ルーム ID は UUID 形式で入力してください。");

	// aria-invalid が設定されることを確認
	await waitFor(() => {
		expect(input).toHaveAttribute("aria-invalid", "true");
	});
});

test("エラーメッセージが aria-describedby で関連付けられていること", async ({
	user,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	await user.click(submitButton);

	// エラーメッセージが表示されるまで待つ
	await screen.findByText("ルーム ID を入力してください。");

	// aria-describedby が設定されていることを確認
	await waitFor(() => {
		const describedBy = input.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();
	});
});

test("フォームコントロールがキーボードで操作可能であること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });

	// Tab キーで入力フィールドにフォーカス
	await user.tab();
	expect(input).toHaveFocus();

	// 入力
	const validUuid = "550e8400-e29b-41d4-a716-446655440000";
	await user.paste(validUuid);

	// Tab キーでボタンにフォーカス
	await user.tab();
	const submitButton = screen.getByRole("button", { name: "参加" });
	expect(submitButton).toHaveFocus();

	// Enter キーで送信
	await user.keyboard("{Enter}");

	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith(`/rooms/${validUuid}`);
	});
});

// Shadcn Form の統合
test("FormField, FormItem, FormLabel, FormControl, FormMessage が適切に機能すること", async ({
	user,
}) => {
	render(<JoinRoomForm />);

	// FormLabel が機能していることを確認
	const label = screen.getByText("ルーム ID");
	expect(label).toBeInTheDocument();

	// FormControl (Input) が機能していることを確認
	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	expect(input).toBeInTheDocument();

	// FormMessage が機能していることを確認（エラー時）
	const submitButton = screen.getByRole("button", { name: "参加" });
	await user.click(submitButton);

	const errorMessage = await screen.findByText(
		"ルーム ID を入力してください。",
	);
	expect(errorMessage).toBeInTheDocument();
});

test("フォームの状態管理が正しく動作すること", async ({
	user,
	mockPush,
}) => {
	render(<JoinRoomForm />);

	const input = screen.getByRole("textbox", { name: "ルーム ID" });
	const submitButton = screen.getByRole("button", { name: "参加" });

	// 初期状態では空
	expect(input).toHaveValue("");

	// 値を入力
	const validUuid = "550e8400-e29b-41d4-a716-446655440000";
	await user.click(input);
	await user.paste(validUuid);

	// 入力された値が反映されることを確認
	expect(input).toHaveValue(validUuid);

	// 送信
	await user.click(submitButton);

	// 送信が成功することを確認
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith(`/rooms/${validUuid}`);
	});
});
