"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import * as v from "valibot";

const actionParamsSchema = v.object({
  roomId: v.pipe(v.string(), v.uuid()),
});

export async function joinRoomAction(
  state: any,
  formData: FormData
): Promise<{ success: false; message: string }> {
  const paramsParsedResult = v.safeParse(
    actionParamsSchema,
    Object.fromEntries(formData.entries())
  );
  if (!paramsParsedResult.success) {
    return { success: false as const, message: "The room id is invalid" };
  }

  const client = await createClient();

  const result = await client
    .from("room")
    .select("*")
    .or(
      `memberRoomId.eq.${paramsParsedResult.output.roomId},ownerRoomId.eq.${paramsParsedResult.output.roomId}`
    )
    .single();

  if (result.error) {
    return {
      success: false,
      message: "The room is not found",
    };
  }

  return redirect(`/rooms/${paramsParsedResult.output.roomId}`);
}
