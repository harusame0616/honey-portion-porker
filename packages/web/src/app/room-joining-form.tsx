"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";

const formSchema = v.object({
	roomId: v.pipe(
		v.string(),
		v.minLength(1, "ルーム ID の入力を入力してください。"),
		v.uuid("ルーム ID は UUID 形式で入力してください。"),
	),
});

export function RoomJoiningForm() {
	const roomIdInputId = useId();
	const router = useRouter();

	const { register, handleSubmit, formState } = useForm<
		v.InferOutput<typeof formSchema>
	>({
		defaultValues: {
			roomId: "",
		},
		resolver: valibotResolver(formSchema),
	});

	async function enterRoom(params: { roomId: string }) {
		router.push(`/rooms/${params.roomId}`);
	}

	return (
		<form onSubmit={handleSubmit(enterRoom)} noValidate>
			<label className="mb-1 text-sm font-bold" htmlFor={roomIdInputId}>
				ルーム ID
			</label>
			<div className="flex gap-1">
				<Input
					type="text"
					required
					{...register("roomId")}
					id={roomIdInputId}
				/>
				<Button className="font-bold">入室</Button>
			</div>
			<div className="text-destructive text-sm mt-1" aria-live="polite">
				{formState.errors.roomId?.message}
			</div>
		</form>
	);
}
