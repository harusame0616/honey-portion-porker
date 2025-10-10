"use client";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
		<form noValidate onSubmit={handleSubmit(enterRoom)}>
			<label className="mb-1 text-sm font-bold" htmlFor={roomIdInputId}>
				ルーム ID
			</label>
			<div className="flex gap-1">
				<Input
					required
					type="text"
					{...register("roomId")}
					id={roomIdInputId}
				/>
				<Button className="font-bold">参加</Button>
			</div>
			<div aria-live="polite" className="text-destructive text-sm mt-1">
				{formState.errors.roomId?.message}
			</div>
		</form>
	);
}
