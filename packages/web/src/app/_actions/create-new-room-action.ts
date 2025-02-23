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
			roomId: randomUUID(),
			ownerRoomId,
			memberRoomId,
		});

		if (result.error) {
			return {
				success: false,
				message: "ルームの作成に失敗しました。",
			};
		}

		return { success: true, data: { ownerRoomId, memberRoomId } };
	} catch (error) {
		return {
			success: false,
			message: "ルームの作成に失敗しました。",
		};
	}
}
