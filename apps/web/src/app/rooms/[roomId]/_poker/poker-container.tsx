import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PokerPresenter } from "./poker-presenter";

async function getRoom(
	roomId: string,
	client: Awaited<ReturnType<typeof createClient>>,
) {
	const roomSelect = await client
		.from("room")
		.select("autoOpen, autoReset, ownerRoomId, memberRoomId")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error || !roomSelect.data.memberRoomId) {
		return {
			data: null,
			message: "ルームが見つかりません | Honey Portion Poker",
			success: false as const,
		};
	}

	return {
		data: {
			autoOpen: roomSelect.data.autoOpen,
			autoReset: roomSelect.data.autoReset,
			memberRoomId: roomSelect.data.memberRoomId,
			ownerRoomId: roomSelect.data.ownerRoomId,
		},
		message: "",
		success: true as const,
	};
}

export async function PokerContainer({ roomId }: { roomId: string }) {
	const client = await createClient();
	const roomGettingResult = await getRoom(roomId, client);

	if (!roomGettingResult.success) {
		notFound();
	}

	const ownerRoomId =
		roomId === roomGettingResult.data.ownerRoomId
			? roomGettingResult.data.ownerRoomId
			: undefined;

	return (
		<PokerPresenter
			initialAutoOpen={roomGettingResult.data.autoOpen}
			initialAutoReset={roomGettingResult.data.autoReset}
			memberRoomId={roomGettingResult.data.memberRoomId}
			ownerRoomId={ownerRoomId}
		/>
	);
}
