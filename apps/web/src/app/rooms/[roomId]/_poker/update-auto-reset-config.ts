"use server";

import { fail, type Result, tryCatchAsync } from "@harusame0616/result";
import { createClient } from "@supabase/supabase-js";
import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Database } from "@/lib/supabase/database.types";

export async function updateAutoResetConfigAction(
	ownerRoomId: string,
	newAutoReset: boolean,
): Promise<Result<void, string>> {
	const client = createClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	).schema("honey_portion_porker");

	return tryCatchAsync(
		async () => {
			// memberRoomId を取得してから更新
			const roomSelect = await client
				.from("room")
				.select("memberRoomId")
				.eq("ownerRoomId", ownerRoomId)
				.single();

			if (roomSelect.error || !roomSelect.data.memberRoomId) {
				return fail("ルームが見つかりません");
			}

			const result = await client
				.from("room")
				.update({
					autoReset: newAutoReset,
				})
				.eq("ownerRoomId", ownerRoomId);

			if (result.error) {
				return fail("自動リセット設定の更新に失敗しました");
			}

			// ownerRoomId と memberRoomId の両方のタグを無効化
			updateTag(CACHE_TAGS.poker(ownerRoomId));
			updateTag(CACHE_TAGS.poker(roomSelect.data.memberRoomId));
		},
		() => "自動リセット設定の更新に失敗しました",
	);
}
