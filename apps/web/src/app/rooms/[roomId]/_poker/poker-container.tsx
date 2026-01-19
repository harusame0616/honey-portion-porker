import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Database } from "@/lib/supabase/database.types";
import { PokerPresenter } from "./poker-presenter";

async function getRoom(roomId: string) {
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

	cacheTag(
		CACHE_TAGS.poker(roomSelect.data.ownerRoomId),
		CACHE_TAGS.poker(roomSelect.data.memberRoomId),
	);

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

export async function PokerContainer({ roomId }: { roomId: Promise<string> }) {
	const resolvedRoomId = await roomId;
	const roomGettingResult = await getRoom(resolvedRoomId);

	if (!roomGettingResult.success) {
		notFound();
	}

	const ownerRoomId =
		resolvedRoomId === roomGettingResult.data.ownerRoomId
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
