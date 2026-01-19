"use server";

import { fail, type Result, succeed } from "@harusame0616/result";
import { createClient } from "@supabase/supabase-js";
import { updateTag } from "next/cache";
import * as v from "valibot";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Database } from "@/lib/supabase/database.types";
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

	const client = createClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	).schema("honey_portion_porker");

	// memberRoomId を取得してから更新
	const roomSelect = await client
		.from("room")
		.select("memberRoomId")
		.eq("ownerRoomId", ownerRoomId)
		.single();

	if (roomSelect.error || !roomSelect.data.memberRoomId) {
		return fail("ルームが見つかりません");
	}

	const { error } = await client
		.from("room")
		.update({ note })
		.eq("ownerRoomId", ownerRoomId);

	if (error) {
		return fail("更新に失敗しました");
	}

	// ownerRoomId と memberRoomId の両方のタグを無効化
	updateTag(CACHE_TAGS.note(ownerRoomId));
	updateTag(CACHE_TAGS.note(roomSelect.data.memberRoomId));

	return succeed();
}
