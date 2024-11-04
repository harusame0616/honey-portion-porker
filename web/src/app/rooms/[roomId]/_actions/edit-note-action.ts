"use server";

import { createClient } from "@/lib/supabase/server";
import * as v from "valibot";

const actionParamsSchema = v.object({
  ownerRoomId: v.string(),
  note: v.string(),
});
type ActionState =
  | { success: false; message: string }
  | { success: true; data: { note: string } };
export async function editNoteAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const paramsParsedResult = v.safeParse(
    actionParamsSchema,
    Object.fromEntries(formData.entries())
  );

  if (!paramsParsedResult.success) {
    return { success: false, message: "invalid request" };
  }

  const { ownerRoomId, note } = paramsParsedResult.output;
  await editNote(ownerRoomId, note);

  return { success: true, data: { note } };
}

async function editNote(ownerRoomId: string, note: string) {
  const client = await createClient();
  await client.from("room").update({ note }).eq("ownerRoomId", ownerRoomId);
}
