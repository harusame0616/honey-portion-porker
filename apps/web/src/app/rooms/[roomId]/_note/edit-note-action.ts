"use server";

import { fail, type Result, succeed } from "@harusame0616/result";
import { revalidatePath } from "next/cache";
import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";
import { NOTE_MAX_LENGTH } from "./edit-note-action.constants";

const editNoteActionParamsSchema = v.object({
	note: v.pipe(v.string(), v.maxLength(NOTE_MAX_LENGTH)),
	ownerRoomId: v.pipe(v.string(), v.uuid()),
});

type EditNoteActionParams = v.InferOutput<typeof editNoteActionParamsSchema>;

export async function editNoteAction(
	params: EditNoteActionParams,
): Promise<Result<void, string>> {
	const paramsParsedResult = v.safeParse(editNoteActionParamsSchema, params);
	if (!paramsParsedResult.success) {
		return fail("入力が不正です");
	}

	const { ownerRoomId, note } = paramsParsedResult.output;

	const client = await createClient();
	const { error } = await client
		.from("room")
		.update({ note })
		.eq("ownerRoomId", ownerRoomId);

	if (error) {
		return fail("更新に失敗しました");
	}

	revalidatePath(`/rooms/${paramsParsedResult.output.ownerRoomId}`, "page");

	return succeed();
}
