"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createNewRoomAction } from "./_actions/create-new-room-action";

export function NewRoomCreation() {
	const [errorMessage, setErrorMessage] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function handleClick() {
		startTransition(async () => {
			const result = await createNewRoomAction();
			if (result.success) {
				router.push(`/rooms/${result.data.ownerRoomId}`);
			} else {
				setErrorMessage(result.message);
			}
			console.log("result", result);
		});
	}

	return (
		<div className="w-full">
			<Button
				disabled={isPending}
				className="w-full font-bold"
				onClick={handleClick}
			>
				{isPending ? (
					<ReloadIcon
						className="animate-spin"
						role="img"
						aria-label="Creating new room"
					/>
				) : (
					"CREATE ROOM"
				)}
			</Button>
			<div className="text-destructive text-sm">{errorMessage}</div>
		</div>
	);
}
