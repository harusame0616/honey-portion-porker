import { ServiceTitle } from "@/components/service-title";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
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
		console.log(roomSelect);
		return {
			success: false as const,
			message: "not found",
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
		return <div>invalid request</div>;
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
		return <div>not found</div>;
	}

	return (
		<div>
			<header className="bg-primary p-4 shadow-md flex">
				<Link href="/">
					<ServiceTitle />
				</Link>
			</header>
			<div className="p-8">
				<main>
					<Room
						roomId={roomGettingResult.data.roomId}
						autoReset={roomGettingResult.data.autoReset}
						autoOpen={roomGettingResult.data.autoOpen}
						ownerRoomId={
							paramsParseResult.output.roomId ===
							roomGettingResult.data.ownerRoomId
								? roomGettingResult.data.ownerRoomId
								: undefined
						}
						memberRoomId={roomGettingResult.data.memberRoomId}
						note={roomGettingResult.data.note}
					/>
				</main>
			</div>
		</div>
	);
}
