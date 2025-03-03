import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback } from "react";

export function useRealtimeCommand(channel: RealtimeChannel, userId: string) {
	const selectCard = useCallback(
		async (number: number) => {
			await channel.track({ card: number, userId });
		},
		[userId, channel],
	);

	const unselectCard = useCallback(async () => {
		await channel.track({ card: undefined, userId });
	}, [userId, channel]);

	const open = useCallback(async () => {
		await channel.send({ type: "broadcast", event: "open" });
	}, [channel]);

	const close = useCallback(async () => {
		await channel.send({ type: "broadcast", event: "close" });
	}, [channel]);

	const reset = useCallback(async () => {
		await channel.send({ type: "broadcast", event: "reset" });
	}, [channel]);

	const changeAutoReset = useCallback(
		async (value: boolean) => {
			await channel.send({
				type: "broadcast",
				event: "update-auto-reset",
				value,
			});
		},
		[channel],
	);

	const changeAutoOpen = useCallback(
		async (value: boolean) => {
			await channel.send({
				type: "broadcast",
				event: "update-auto-open",
				value,
			});
		},
		[channel],
	);

	const changeNote = useCallback(
		async (value: string) => {
			await channel.send({
				type: "broadcast",
				event: "update-note",
				value,
			});
		},
		[channel],
	);

	return {
		selectCard,
		unselectCard,
		open,
		close,
		reset,
		changeAutoReset,
		changeAutoOpen,
		changeNote,
	};
}
