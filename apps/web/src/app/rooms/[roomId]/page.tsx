import { createClient } from "@supabase/supabase-js";
import { after } from "next/server";
import { Suspense } from "react";
import type { Database } from "@/lib/supabase/database.types";
import { NoteServerContainer } from "./_note/note-server-container";
import { NoteSkeleton } from "./_note/note-skeleton";
import { PokerContainer } from "./_poker/poker-container";
import { PokerSkeleton } from "./_poker/poker-skeleton";
import { RoomInformationContainer } from "./_room-information/room-information-container";
import { RoomInformationSkeleton } from "./_room-information/room-information-skeleton";

export async function generateMetadata({
	params,
}: PageProps<"/rooms/[roomId]">) {
	const { roomId } = await params;

	const client = createClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	).schema("honey_portion_porker");
	const roomSelect = await client
		.from("room")
		.select("ownerRoomId")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error) {
		return {
			title: "ルームが見つかりません | Honey Portion Poker",
		};
	}

	return {
		title: `${roomSelect.data.ownerRoomId === roomId ? "オーナー" : "メンバー"}ルーム | Honey Portion Poker`,
	};
}

async function _updateRoom(roomId: string) {
	const client = createClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: 一時的に無効化。あとで型安全のシステムを導入予定
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	).schema("honey_portion_porker");
	await client
		.from("room")
		.update({ updatedAt: new Date().toISOString() })
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`);
}

export default async function Page({ params }: PageProps<"/rooms/[roomId]">) {
	// params.then() で roomId を Promise として取得
	const roomId = params.then((p) => p.roomId);

	return (
		<div className="space-y-4">
			<Suspense fallback={null}>
				<UpdateRoom roomId={roomId} />
			</Suspense>
			<Suspense fallback={<NoteSkeleton />}>
				<NoteServerContainer roomId={roomId} />
			</Suspense>
			<Suspense fallback={<PokerSkeleton />}>
				<PokerContainer roomId={roomId} />
			</Suspense>
			<Suspense fallback={<RoomInformationSkeleton />}>
				<RoomInformationContainer roomId={roomId} />
			</Suspense>
		</div>
	);
}

async function UpdateRoom({ roomId }: { roomId: Promise<string> }) {
	after(async () => {
		roomId;
	});

	return null;
}
