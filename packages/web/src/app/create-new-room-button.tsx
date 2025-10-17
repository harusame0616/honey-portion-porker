"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createNewRoomAction } from "./_actions/create-new-room-action";

export function CreateNewRoomButton() {
	const [errorMessage, setErrorMessage] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function handleClick() {
		startTransition(async () => {
			const result = await createNewRoomAction();
			if (result.success) {
				router.push(`/rooms/${result.data.ownerRoomId}`);
			} else {
				setErrorMessage(result.error);
			}
		});
	}

	return (
		<>
			<Button
				className="w-full font-bold"
				disabled={isPending}
				onClick={handleClick}
			>
				{isPending ? (
					<ReloadIcon
						aria-label="Creating new room"
						className="animate-spin"
						role="img"
					/>
				) : (
					"CREATE ROOM"
				)}
			</Button>
			<div
				aria-atomic="true"
				aria-live="polite"
				className="text-destructive text-sm mt-1 min-h-5"
			>
				{errorMessage}
			</div>
		</>
	);
}
