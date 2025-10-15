import { createClient } from "@/lib/supabase/server";
import { NoteClientContainer } from "./note-client-container";
import { NotePresenter } from "./note-presenter";

type NoteServerContainerProps = {
	roomId: string;
};

async function getRoomNoteData(
	roomId: string,
	client: Awaited<ReturnType<typeof createClient>>,
) {
	const roomSelect = await client
		.from("room")
		.select("note, ownerRoomId")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error || !roomSelect.data) {
		return {
			isOwner: false,
			note: "",
		};
	}

	return {
		isOwner: roomSelect.data.ownerRoomId === roomId,
		note: roomSelect.data.note,
	};
}

export async function NoteServerContainer({
	roomId,
}: NoteServerContainerProps) {
	const client = await createClient();
	const { note, isOwner } = await getRoomNoteData(roomId, client);

	if (!isOwner) {
		return <NotePresenter note={note} />;
	}

	return <NoteClientContainer note={note} roomId={roomId} />;
}
