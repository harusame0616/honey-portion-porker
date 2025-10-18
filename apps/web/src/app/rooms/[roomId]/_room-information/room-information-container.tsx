import { createClient } from "@/lib/supabase/server";
import { RoomInformationPresenter } from "./room-information-presenter";

async function getMemberRoomId(
	roomId: string,
	client: Awaited<ReturnType<typeof createClient>>,
) {
	const roomSelect = await client
		.from("room")
		.select("memberRoomId")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error || !roomSelect.data.memberRoomId) {
		return null;
	}

	return roomSelect.data.memberRoomId;
}

export async function RoomInformationContainer({ roomId }: { roomId: string }) {
	const client = await createClient();
	const memberRoomId = await getMemberRoomId(roomId, client);

	if (!memberRoomId) {
		return null;
	}

	return <RoomInformationPresenter memberRoomId={memberRoomId} />;
}
