import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Database } from "@/lib/supabase/database.types";
import { RoomInformationPresenter } from "./room-information-presenter";

async function getMemberRoomId(roomId: string) {
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
		.select("memberRoomId, ownerRoomId")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error || !roomSelect.data.memberRoomId) {
		return null;
	}

	cacheTag(
		CACHE_TAGS.roomInfo(roomSelect.data.ownerRoomId),
		CACHE_TAGS.roomInfo(roomSelect.data.memberRoomId),
	);

	return roomSelect.data.memberRoomId;
}

export async function RoomInformationContainer({
	roomId,
}: {
	roomId: Promise<string>;
}) {
	const resolvedRoomId = await roomId;
	const memberRoomId = await getMemberRoomId(resolvedRoomId);

	if (!memberRoomId) {
		return null;
	}

	return <RoomInformationPresenter memberRoomId={memberRoomId} />;
}
