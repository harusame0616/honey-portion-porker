import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Database } from "@/lib/supabase/database.types";
import { NoteClientContainer } from "./note-client-container";
import { NotePresenter } from "./note-presenter";

type NoteServerContainerProps = {
	roomId: Promise<string>;
};

async function getRoomNoteData(roomId: string) {
	"use cache";
	cacheLife("permanent");

	const client = createClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	).schema("honey_portion_porker");
	const roomSelect = await client
		.from("room")
		.select("note, ownerRoomId, memberRoomId")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error || !roomSelect.data) {
		return {
			isOwner: false,
			memberRoomId: null,
			note: "",
			ownerRoomId: null,
		};
	}

	cacheTag(
		CACHE_TAGS.note(roomSelect.data.ownerRoomId),
		CACHE_TAGS.note(roomSelect.data.memberRoomId),
	);

	return {
		isOwner: roomSelect.data.ownerRoomId === roomId,
		memberRoomId: roomSelect.data.memberRoomId,
		note: roomSelect.data.note,
		ownerRoomId: roomSelect.data.ownerRoomId,
	};
}

export async function NoteServerContainer({
	roomId,
}: NoteServerContainerProps) {
	const resolvedRoomId = await roomId;
	const { note, isOwner } = await getRoomNoteData(resolvedRoomId);

	if (!isOwner) {
		return <NotePresenter note={note} />;
	}

	return <NoteClientContainer note={note} roomId={resolvedRoomId} />;
}
