import { useCallback, useMemo } from "react";
import type { Channel } from "./use-cannel";

export function useRealtimeCommand(channel: Channel, userId: string) {
	const command = useMemo(
		() => ({
			selectCard: async (number: number) => {
				await channel.ref.current.track({ card: number, userId });
			},
			unselectCard: async () => {
				await channel.ref.current.track({ card: undefined, userId });
			},
			open: async () => {
				await channel.ref.current.send({ type: "broadcast", event: "open" });
			},
			close: async () => {
				await channel.ref.current.send({ type: "broadcast", event: "close" });
			},
			reset: async () => {
				await channel.ref.current.send({ type: "broadcast", event: "reset" });
			},
			changeAutoReset: async (value: boolean) => {
				await channel.ref.current.send({
					type: "broadcast",
					event: "update-auto-reset",
					value,
				});
			},
			changeAutoOpen: async (value: boolean) => {
				await channel.ref.current.send({
					type: "broadcast",
					event: "update-auto-open",
					value,
				});
			},
			changeNote: async (value: string) => {
				await channel.ref.current.send({
					type: "broadcast",
					event: "update-note",
					value,
				});
			},
		}),
		[userId, channel],
	);

	return command;
}
