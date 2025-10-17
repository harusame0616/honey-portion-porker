"use server";

import { randomUUID } from "node:crypto";
import {
	fail,
	type Result,
	succeed,
	tryCatchAsync,
} from "@harusame0616/result";
import { createClient } from "@/lib/supabase/server";

export async function createNewRoomAction(): Promise<
	Result<{ ownerRoomId: string; memberRoomId: string }, string>
> {
	const client = await createClient();

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
		console.error(insertResult.error)
		return fail(`${insertResult.error.message}/${insertResult.error.name}`);
	}

	return succeed({ memberRoomId, ownerRoomId });
}
