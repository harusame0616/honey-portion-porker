import { useMemo } from "react";
import type { Channel } from "./use-cannel";

export function useRealtimeCommand(channel: Channel, userId: string) {
	const command = useMemo(
		() => ({
			changeAutoOpen: async (value: boolean) => {
				await channel.ref.current.send({
					event: "update-auto-open",
					type: "broadcast",
					value,
				});
			},
			changeAutoReset: async (value: boolean) => {
				await channel.ref.current.send({
					event: "update-auto-reset",
					type: "broadcast",
					value,
				});
			},
			changeNote: async (value: string) => {
				await channel.ref.current.send({
					event: "update-note",
					type: "broadcast",
					value,
				});
			},
			close: async () => {
				await channel.ref.current.send({ event: "close", type: "broadcast" });
			},
			open: async () => {
				await channel.ref.current.send({ event: "open", type: "broadcast" });
			},
			reset: async () => {
				await channel.ref.current.send({ event: "reset", type: "broadcast" });
			},
			selectCard: async (number: number) => {
				await channel.ref.current.track({ card: number, userId });
			},
			unselectCard: async () => {
				await channel.ref.current.track({ card: undefined, userId });
			},
		}),
		[userId, channel],
	);

	return command;
}
