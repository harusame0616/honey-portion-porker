"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export async function createNewRoomAction(): Promise<
	| {
			success: true;
			data: { ownerRoomId: string; memberRoomId: string };
	  }
	| { success: false; message: string }
> {
	const client = await createClient();

	const ownerRoomId = randomUUID();
	const memberRoomId = randomUUID();

	try {
		const result = await client.from("room").insert({
			memberRoomId,
			ownerRoomId,
			roomId: randomUUID(),
		});

		if (result.error) {
			return {
				message: "ルームの作成に失敗しました。",
				success: false,
			};
		}

		return { data: { memberRoomId, ownerRoomId }, success: true };
	} catch (_error) {
		return {
			message: "ルームの作成に失敗しました。",
			success: false,
		};
	}
}
