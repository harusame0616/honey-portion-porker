"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type ActionReturn = Promise<{ success: false; message: string } | undefined>;

async function createNewRoom(): Promise<
	| {
			success: true;
			data: { roomId: string; ownerRoomId: string; memberRoomId: string };
	  }
	| { success: false; message: string }
> {
	const client = await createClient();

	const newRoom = {
		roomId: randomUUID(),
		ownerRoomId: randomUUID(),
		memberRoomId: randomUUID(),
	};

	const result = await client.from("room").insert(newRoom);

	if (result.error) {
		return {
			success: false,
			message: "ルームの作成に失敗しました。",
		};
	}

	return { success: true, data: newRoom };
}

export async function createNewRoomAction(): ActionReturn {
	const newRoomCreationResult = await createNewRoom();

	return newRoomCreationResult.success
		? redirect(`/rooms/${newRoomCreationResult.data.ownerRoomId}`)
		: { success: false, message: newRoomCreationResult.message };
}
