"use client";

import { useId } from "react";
import { Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { CopyButton } from "./copy-button";

export function RoomInformationPresenter({
	memberRoomId,
}: {
	memberRoomId: string;
}) {
	const memberRoomIdInputId = useId();
	const memberRoomUrlInputId = useId();
	const memberRoomUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`;

	return (
		<Section className="flex flex-col gap-2" title="Room information">
			<div>
				<label className="text-sm" htmlFor={memberRoomIdInputId}>
					Member Room ID
				</label>
				<div className="flex">
					<Input
						className="max-w-80"
						id={memberRoomIdInputId}
						name="roomId"
						readOnly
						value={memberRoomId}
					/>
					<CopyButton text={memberRoomId} />
				</div>
			</div>
			<div>
				<label className="text-sm" htmlFor={memberRoomUrlInputId}>
					Member Room URL
				</label>
				<div className="flex">
					<Input
						className="max-w-[605px]"
						id={memberRoomUrlInputId}
						name="roomId"
						readOnly
						value={memberRoomUrl}
					/>
					<CopyButton text={memberRoomUrl} />
				</div>
			</div>
		</Section>
	);
}
