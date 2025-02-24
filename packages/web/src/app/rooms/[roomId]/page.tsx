import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { unstable_after as after } from "next/server";
import * as v from "valibot";
import { Room } from "./room";

async function getRoom(
	roomId: string,
	client: Awaited<ReturnType<typeof createClient>>,
) {
	const roomSelect = await client
		.from("room")
		.select("*")
		.or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
		.single();

	if (roomSelect.error || !roomSelect.data.roomId) {
		return {
			success: false as const,
			message: "ルームが見つかりません | Honey Portion Poker",
			data: null,
		};
	}

	return {
		success: true as const,
		message: "",
		data: {
			roomId: roomSelect.data.roomId,
			ownerRoomId: roomSelect.data.ownerRoomId,
			memberRoomId: roomSelect.data.memberRoomId,
			note: roomSelect.data.note,
			autoReset: roomSelect.data.autoReset,
			autoOpen: roomSelect.data.autoOpen,
		},
	};
}

export async function generateMetadata({
	params,
}: { params: Promise<{ roomId: string }> }) {
	const paramsParseResult = v.safeParse(paramsSchema, await params);
	if (!paramsParseResult.success) {
		return {
			title: "不正なルーム ID です",
		};
	}

	const room = await getRoom(
		paramsParseResult.output.roomId,
		await createClient(),
	);

	if (!room.success) {
		return {
			title: room.message,
		};
	}

	return {
		title: `${room.data.ownerRoomId === paramsParseResult.output.roomId ? "オーナー" : "メンバー"}ルーム | Honey Portion Poker`,
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

export default async function Page({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const paramsParseResult = v.safeParse(paramsSchema, await params);

	if (!paramsParseResult.success) {
		return notFound();
	}

	const client = await createClient();
	after(async () => {
		await updateRoom(paramsParseResult.output.roomId, client);
	});

	const roomGettingResult = await getRoom(
		paramsParseResult.output.roomId,
		client,
	);

	if (!roomGettingResult.success) {
		notFound();
	}

	return (
		<Room
			roomId={roomGettingResult.data.roomId}
			autoReset={roomGettingResult.data.autoReset}
			autoOpen={roomGettingResult.data.autoOpen}
			ownerRoomId={
				paramsParseResult.output.roomId === roomGettingResult.data.ownerRoomId
					? roomGettingResult.data.ownerRoomId
					: undefined
			}
			memberRoomId={roomGettingResult.data.memberRoomId}
			note={roomGettingResult.data.note}
		/>
	);
}
