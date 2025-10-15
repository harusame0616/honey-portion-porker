import { notFound } from "next/navigation";
import { after } from "next/server";
import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";
import { Room } from "./room";
import { RSCRoom } from "./sc-room";

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
			note: roomSelect.data.note,
			ownerRoomId: roomSelect.data.ownerRoomId,
			roomId: roomSelect.data.roomId,
		},
		message: "",
		success: true as const,
	};
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
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

	const ownerRoomId =
		paramsParseResult.output.roomId === roomGettingResult.data.ownerRoomId
			? roomGettingResult.data.ownerRoomId
			: undefined;

	return (
		<div className="space-y-4">
			<RSCRoom roomId={paramsParseResult.output.roomId} />
			<Room
				initialAutoOpen={roomGettingResult.data.autoOpen}
				initialAutoReset={roomGettingResult.data.autoReset}
				memberRoomId={roomGettingResult.data.memberRoomId}
				ownerRoomId={ownerRoomId}
				roomId={roomGettingResult.data.roomId}
			/>
		</div>
	);
}
