"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateAutoOpenAction(
  ownerRoomId: string,
  newAutoReset: boolean
) {
  try {
    await updateAutoOpen(ownerRoomId, newAutoReset);
  } catch {
    return {
      success: false,
      message: "Failed to update auto open config",
    };
  }

  return { success: true };
}

async function updateAutoOpen(ownerRoomId: string, autoOpen: boolean) {
  const client = await createClient();
  await client
    .from("room")
    .update({
      autoOpen,
    })
    .eq("ownerRoomId", ownerRoomId);
}
