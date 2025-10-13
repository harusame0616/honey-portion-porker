"use server";

import { fail, type Result, succeed } from "@harusame0616/result";
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

type ActionState = Result<
	{ inputs: { note: string } },
	{ message: string; errors: { note: string }; inputs: { note: string } }
>;
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
		return fail({
			errors: { note: nested?.note?.[0] || "" },
			inputs: { note: "" },
			message: "invalid request",
		});
	}

	const paramsParsedResult = v.safeParse(
		actionParamsSchema,
		inputsParsedResult.output,
	);
	if (!paramsParsedResult.success) {
		const nested = v.flatten(paramsParsedResult.issues).nested;

		return fail({
			errors: { note: nested?.note?.[0] || "" },
			inputs: inputsParsedResult.output,
			message: "invalid request",
		});
	}

	const { ownerRoomId, note } = paramsParsedResult.output;
	await editNote(ownerRoomId, note);

	return succeed({ inputs: { note } });
}

async function editNote(ownerRoomId: string, note: string) {
	const client = await createClient();
	await client.from("room").update({ note }).eq("ownerRoomId", ownerRoomId);
}
