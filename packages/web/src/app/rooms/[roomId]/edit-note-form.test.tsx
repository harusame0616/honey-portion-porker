import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { EditNoteForm } from "./edit-note-form";

// モックの準備
vi.mock("./_actions/edit-note-action", () => ({
	editNoteAction: vi.fn(),
}));

test("note がテキストエリアに表示される", () => {
	// TODO: 実装
});

test("4096文字を入力して送信できる", async () => {
	// TODO: 実装
});

test("0文字で送信できる", async () => {
	// TODO: 実装
});

test("4097文字を入力して送信するとエラーが表示される。", async () => {
	// TODO: 実装
});

test("編集に成功すると入力内容を引数に onSubmit が呼ばれる", async () => {
	// TODO: 実装
});

test("編集に失敗するとエラーメッセージが表示され、onSubmit が呼ばれない", async () => {
	// TODO: 実装
});

test("送信中はSaveボタンがdisabledになる", async () => {
	// TODO: 実装
});

test("送信完了後はSaveボタンが再び有効になる", async () => {
	// TODO: 実装
});
