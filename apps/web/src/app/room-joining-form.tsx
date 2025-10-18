"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = v.object({
	roomId: v.pipe(
		v.string(),
		v.minLength(1, "ルーム ID を入力してください。"),
		v.uuid("ルーム ID は UUID 形式で入力してください。"),
	),
});

export function JoinRoomForm() {
	const router = useRouter();

	const form = useForm<v.InferOutput<typeof formSchema>>({
		defaultValues: {
			roomId: "",
		},
		resolver: valibotResolver(formSchema),
	});

	async function enterRoom(params: { roomId: string }) {
		router.push(`/rooms/${params.roomId}`);
	}

	return (
		<Form {...form}>
			<form noValidate onSubmit={form.handleSubmit(enterRoom)}>
				<FormField
					control={form.control}
					name="roomId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ルーム ID</FormLabel>
							<div className="flex gap-1">
								<FormControl>
									<Input required {...field} />
								</FormControl>
								<Button className="font-bold" type="submit">
									参加
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
