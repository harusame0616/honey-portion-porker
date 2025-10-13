import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { EditNoteForm } from "./edit-note-form";

// モックの準備
const mockEditNoteAction = vi.hoisted(() => vi.fn());

vi.mock("./_actions/edit-note-action", () => ({
	editNoteAction: mockEditNoteAction,
}));

beforeEach(() => {
	mockEditNoteAction.mockReset();
});

test("note がテキストエリアに表示される", () => {
	const mockOnSubmit = vi.fn();
	render(
		<EditNoteForm
			note="テストノート"
			onSubmit={mockOnSubmit}
			ownerRoomId="test-room-id"
		/>,
	);

	const textarea = screen.getByRole("textbox");
	expect(textarea).toHaveValue("テストノート");
});

test("4096文字を入力して送信できる", async () => {
	const user = userEvent.setup();
	const mockOnSubmit = vi.fn();
	mockEditNoteAction.mockResolvedValue({ data: undefined, success: true });

	render(
		<EditNoteForm note="" onSubmit={mockOnSubmit} ownerRoomId="test-room-id" />,
	);

	const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
	const text4096 = "a".repeat(4096);
	await user.click(textarea);
	await user.paste(text4096);

	const saveButton = screen.getByRole("button", { name: "Save" });
	await user.click(saveButton);

	await waitFor(() => {
		expect(mockEditNoteAction).toHaveBeenCalledWith({
			note: text4096,
			ownerRoomId: "test-room-id",
		});
	});

	expect(mockOnSubmit).toHaveBeenCalledWith(text4096);
});

test("0文字で送信できる", async () => {
	const user = userEvent.setup();
	const mockOnSubmit = vi.fn();
	mockEditNoteAction.mockResolvedValue({ data: undefined, success: true });

	render(
		<EditNoteForm
			note="初期値"
			onSubmit={mockOnSubmit}
			ownerRoomId="test-room-id"
		/>,
	);

	const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
	await user.click(textarea);
	await user.clear(textarea);

	const saveButton = screen.getByRole("button", { name: "Save" });
	await user.click(saveButton);

	await waitFor(() => {
		expect(mockEditNoteAction).toHaveBeenCalledWith({
			note: "",
			ownerRoomId: "test-room-id",
		});
	});

	expect(mockOnSubmit).toHaveBeenCalledWith("");
});

test("4097文字を入力して送信するとエラーが表示される。", async () => {
	const user = userEvent.setup();
	const mockOnSubmit = vi.fn();

	render(
		<EditNoteForm note="" onSubmit={mockOnSubmit} ownerRoomId="test-room-id" />,
	);

	const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
	const text4097 = "a".repeat(4097);
	await user.click(textarea);
	await user.paste(text4097);

	const saveButton = screen.getByRole("button", { name: "Save" });
	await user.click(saveButton);

	expect(
		await screen.findByText("4096文字以内で入力してください"),
	).toBeInTheDocument();
	expect(mockEditNoteAction).not.toHaveBeenCalled();
	expect(mockOnSubmit).not.toHaveBeenCalled();
});

test("編集に成功すると入力内容を引数に onSubmit が呼ばれる", async () => {
	const user = userEvent.setup();
	const mockOnSubmit = vi.fn();
	mockEditNoteAction.mockResolvedValue({ data: undefined, success: true });

	render(
		<EditNoteForm
			note="初期値"
			onSubmit={mockOnSubmit}
			ownerRoomId="test-room-id"
		/>,
	);

	const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
	await user.click(textarea);
	await user.clear(textarea);
	await user.paste("更新されたノート");

	const saveButton = screen.getByRole("button", { name: "Save" });
	await user.click(saveButton);

	await waitFor(() => {
		expect(mockEditNoteAction).toHaveBeenCalledWith({
			note: "更新されたノート",
			ownerRoomId: "test-room-id",
		});
	});

	expect(mockOnSubmit).toHaveBeenCalledWith("更新されたノート");
});

test("編集に失敗するとエラーメッセージが表示され、onSubmit が呼ばれない", async () => {
	const user = userEvent.setup();
	const mockOnSubmit = vi.fn();
	mockEditNoteAction.mockResolvedValue({
		error: "更新に失敗しました",
		success: false,
	});

	render(
		<EditNoteForm
			note="初期値"
			onSubmit={mockOnSubmit}
			ownerRoomId="test-room-id"
		/>,
	);

	const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
	await user.click(textarea);
	await user.clear(textarea);
	await user.paste("更新されたノート");

	const saveButton = screen.getByRole("button", { name: "Save" });
	await user.click(saveButton);

	expect(await screen.findByText("更新に失敗しました")).toBeInTheDocument();
	expect(mockOnSubmit).not.toHaveBeenCalled();
});

test("送信中はSaveボタンがdisabledになり、送信完了後に再び有効になる", async () => {
	const user = userEvent.setup();
	const mockOnSubmit = vi.fn();
	let resolvePromise!: () => void;
	const promise = new Promise<{ success: true; data: undefined }>((resolve) => {
		resolvePromise = () => resolve({ data: undefined, success: true });
	});
	mockEditNoteAction.mockReturnValue(promise);

	render(
		<EditNoteForm
			note="初期値"
			onSubmit={mockOnSubmit}
			ownerRoomId="test-room-id"
		/>,
	);

	const saveButton = screen.getByRole("button", { name: "Save" });
	await user.click(saveButton);

	// 送信中はdisabled
	expect(saveButton).toBeDisabled();

	// 送信完了
	resolvePromise();
	await waitFor(() => {
		expect(saveButton).not.toBeDisabled();
	});
});
