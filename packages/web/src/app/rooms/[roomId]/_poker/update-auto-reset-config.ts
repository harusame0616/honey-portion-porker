"use server";

import { fail, type Result, tryCatchAsync } from "@harusame0616/result";
import { createClient } from "@/lib/supabase/server";

export async function updateAutoResetConfigAction(
	ownerRoomId: string,
	newAutoReset: boolean,
): Promise<Result<void, string>> {
	const client = await createClient();

	return tryCatchAsync(
		async () => {
			const result = await client
				.from("room")
				.update({
					autoReset: newAutoReset,
				})
				.eq("ownerRoomId", ownerRoomId);

			if (result.error) {
				return fail("自動リセット設定の更新に失敗しました");
			}
		},
		() => "自動リセット設定の更新に失敗しました",
	);
}
