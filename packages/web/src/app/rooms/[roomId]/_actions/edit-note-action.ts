"use server";

import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";

const inputSchema = v.object({
	note: v.string(),
	ownerRoomId: v.string(),
});

const actionParamsSchema = v.object({
	note: v.pipe(v.string(), v.maxLength(4096)),
	ownerRoomId: v.pipe(v.string(), v.uuid()),
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
			errors: { note: nested?.note?.[0] || "" },
			inputs: { note: "" },
			message: "invalid request",
			success: false,
		};
	}

	const paramsParsedResult = v.safeParse(
		actionParamsSchema,
		inputsParsedResult.output,
	);
	if (!paramsParsedResult.success) {
		const nested = v.flatten(paramsParsedResult.issues).nested;

		return {
			errors: { note: nested?.note?.[0] || "" },
			inputs: inputsParsedResult.output,
			message: "invalid request",
			success: false,
		};
	}

	const { ownerRoomId, note } = paramsParsedResult.output;
	await editNote(ownerRoomId, note);

	return { inputs: { note }, success: true };
}

async function editNote(ownerRoomId: string, note: string) {
	const client = await createClient();
	await client.from("room").update({ note }).eq("ownerRoomId", ownerRoomId);
}
