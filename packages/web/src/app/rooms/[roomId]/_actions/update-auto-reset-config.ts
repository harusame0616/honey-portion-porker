"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateAutoResetConfigAction(
	ownerRoomId: string,
	newAutoReset: boolean,
) {
	try {
		await updateAutoReset(ownerRoomId, newAutoReset);
	} catch {
		return {
			success: false,
			message: "Failed to update auto reset config",
		};
	}

	return { success: true };
}

async function updateAutoReset(ownerRoomId: string, autoReset: boolean) {
	const client = await createClient();
	await client
		.from("room")
		.update({
			autoReset,
		})
		.eq("ownerRoomId", ownerRoomId);
}
