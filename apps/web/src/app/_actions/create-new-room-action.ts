"use server";

import { randomUUID } from "node:crypto";
import {
	fail,
	type Result,
	succeed,
	tryCatchAsync,
} from "@harusame0616/result";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function createNewRoomAction(): Promise<
	Result<{ ownerRoomId: string; memberRoomId: string }, string>
> {
	const client = createClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	).schema("honey_portion_porker");

	const ownerRoomId = randomUUID();
	const memberRoomId = randomUUID();

	const insertResult = await tryCatchAsync(async () => {
		const result = await client.from("room").insert({
			memberRoomId,
			ownerRoomId,
			roomId: randomUUID(),
		});

		if (result.error) {
			return fail(result.error);
		}
	});

	if (!insertResult.success) {
		return fail("ルームの作成に失敗しました");
	}

	return succeed({ memberRoomId, ownerRoomId });
}
