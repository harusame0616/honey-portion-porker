"use server";

import { createClient } from "@/lib/supabase/server";
import * as v from "valibot";

const inputSchema = v.object({
	ownerRoomId: v.string(),
	note: v.string(),
});

const actionParamsSchema = v.object({
	ownerRoomId: v.pipe(v.string(), v.uuid()),
	note: v.pipe(v.string(), v.maxLength(4096)),
});
type ActionState =
	| {
			success: false;
			message: string;
			errors: { note: string };
			inputs: { note: string };
	  }
	| { success: true; inputs: { note: string } };
export async function editNoteAction(
	_: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const inputsParsedResult = v.safeParse(
		inputSchema,
		Object.fromEntries(formData.entries()),
	);
	if (!inputsParsedResult.success) {
		const nested = v.flatten(inputsParsedResult.issues).nested;
		return {
			success: false,
			errors: { note: nested?.note?.[0] || "" },
			message: "invalid request",
			inputs: { note: "" },
		};
	}

	const paramsParsedResult = v.safeParse(
		actionParamsSchema,
		inputsParsedResult.output,
	);
	if (!paramsParsedResult.success) {
		const nested = v.flatten(paramsParsedResult.issues).nested;

		return {
			success: false,
			message: "invalid request",
			errors: { note: nested?.note?.[0] || "" },
			inputs: inputsParsedResult.output,
		};
	}

	const { ownerRoomId, note } = paramsParsedResult.output;
	await editNote(ownerRoomId, note);

	return { success: true, inputs: { note } };
}

async function editNote(ownerRoomId: string, note: string) {
	const client = await createClient();
	await client.from("room").update({ note }).eq("ownerRoomId", ownerRoomId);
}
