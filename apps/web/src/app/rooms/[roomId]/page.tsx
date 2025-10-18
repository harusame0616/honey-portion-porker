import { notFound } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";
import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";
import { NoteServerContainer } from "./_note/note-server-container";
import { NoteSkeleton } from "./_note/note-skeleton";
import { PokerContainer } from "./_poker/poker-container";
import { PokerSkeleton } from "./_poker/poker-skeleton";
import { RoomInformationContainer } from "./_room-information/room-information-container";
import { RoomInformationSkeleton } from "./_room-information/room-information-skeleton";

export async function generateMetadata({
	params,
}: PageProps<"/rooms/[roomId]">) {
	const paramsParseResult = v.safeParse(paramsSchema, await params);
	if (!paramsParseResult.success) {
		return {
			title: "不正なルーム ID です",
		};
	}

	const client = await createClient();
	const roomSelect = await client
		.from("room")
		.select("ownerRoomId")
		.or(
			`ownerRoomId.eq.${paramsParseResult.output.roomId},memberRoomId.eq.${paramsParseResult.output.roomId}`,
		)
		.single();

	if (roomSelect.error) {
		return {
			title: "ルームが見つかりません | Honey Portion Poker",
		};
	}

	return {
		title: `${roomSelect.data.ownerRoomId === paramsParseResult.output.roomId ? "オーナー" : "メンバー"}ルーム | Honey Portion Poker`,
	};
}

async function updateRoom(
	roomId: string,
	client: Awaited<ReturnType<typeof createClient>>,
) {
	await client
		.from("room")
		.update({ updatedAt: new Date().toISOString() })
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`);
}

const paramsSchema = v.object({
	roomId: v.pipe(v.string(), v.uuid()),
});

export default async function Page({ params }: PageProps<"/rooms/[roomId]">) {
	const paramsParseResult = v.safeParse(paramsSchema, await params);

	if (!paramsParseResult.success) {
		return notFound();
	}

	const client = await createClient();
	after(async () => {
		await updateRoom(paramsParseResult.output.roomId, client);
	});

	return (
		<div className="space-y-4">
			<Suspense fallback={<NoteSkeleton />}>
				<NoteServerContainer roomId={paramsParseResult.output.roomId} />
			</Suspense>
			<Suspense fallback={<PokerSkeleton />}>
				<PokerContainer roomId={paramsParseResult.output.roomId} />
			</Suspense>
			<Suspense fallback={<RoomInformationSkeleton />}>
				<RoomInformationContainer roomId={paramsParseResult.output.roomId} />
			</Suspense>
		</div>
	);
}
