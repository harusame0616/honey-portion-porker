import type { RealtimeChannel } from "@supabase/supabase-js";
import { type MutableRefObject, useEffect } from "react";

type Presence = {
	card: number;
	userId: string;
};

type PokerEvent = {
	onPresenceChange: (presence: Presence[]) => void;
	onOpen: () => void;
	onClose: () => void;
	onReset: () => void;
	onUpdateAutoOpen: (value: boolean) => void;
	onUpdateAutoReset: (value: boolean) => void;
	onUpdateNote: (value: string) => void;
	onSubscribe: () => void;
};
export function useRealtimeListener(
	channel: MutableRefObject<RealtimeChannel>,
	{
		onPresenceChange,
		onOpen,
		onClose,
		onReset,
		onUpdateAutoOpen,
		onUpdateAutoReset,
		onUpdateNote,
		onSubscribe,
	}: PokerEvent,
) {
	useEffect(() => {
		channel.current
			.on("presence", { event: "sync" }, () => {
				const newState = channel.current.presenceState<{
					card: number;
					userId: string;
				}>();
				const newUsers = Object.values(newState).map(([{ card, userId }]) => ({
					userId,
					card,
				}));
				onPresenceChange(newUsers);
			})
			.on("broadcast", { event: "open" }, onOpen)
			.on("broadcast", { event: "close" }, onClose)
			.on("broadcast", { event: "reset" }, onReset)
			.on("broadcast", { event: "update-auto-open" }, ({ value }) => {
				onUpdateAutoOpen(value);
			})
			.on("broadcast", { event: "update-auto-reset" }, ({ value }) => {
				onUpdateAutoReset(value);
			})
			.on("broadcast", { event: "update-note" }, ({ value }) => {
				onUpdateNote(value);
			})
			.subscribe(async (status) => {
				if (status !== "SUBSCRIBED") {
					return;
				}
				onSubscribe();
			});

		return () => {
			channel.current.unsubscribe();
		};
	}, [
		onPresenceChange,
		onOpen,
		onClose,
		onReset,
		onUpdateAutoOpen,
		onUpdateAutoReset,
		onUpdateNote,
		onSubscribe,
		channel,
	]);
}
