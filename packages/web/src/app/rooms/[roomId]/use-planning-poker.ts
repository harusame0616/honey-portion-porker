import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "./use-timer";

type Params = {
	roomId: string;
	ownerRoomId?: string;
	initialAutoReset: boolean;
	initialAutoOpen: boolean;
	initialNote: string;
};

export const AUTO_OPEN_MINUTES = 1;

const client = createBrowserClient(
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
let channel: ReturnType<(typeof client)["channel"]>;

export function usePlanningPoker({
	roomId,
	ownerRoomId,
	initialAutoReset,
	initialAutoOpen,
	initialNote,
}: Params) {
	const userId = useRef<string>(window.crypto.randomUUID());
	const [users, setUsers] = useState<{ card: number; userId: string }[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [autoReset, setAutoReset] = useState(initialAutoReset);
	const [autoOpen, setAutoOpen] = useState(initialAutoOpen);
	const autoOpenRef = useRef(initialAutoOpen);
	const [note, setNote] = useState(initialNote);

	const router = useRouter();

	const reset = useCallback(async () => {
		await channel.send({ type: "broadcast", event: "reset" });
	}, []);

	const { startTimer, stopTimer, initializeTimer } = useTimer(
		1000 * 60 * AUTO_OPEN_MINUTES,
		reset,
	);

	useEffect(() => {
		if (!ownerRoomId || !isOpen || !autoReset) {
			return;
		}

		startTimer();
		return stopTimer();
	}, [autoReset, stopTimer, startTimer, ownerRoomId, isOpen]);

	useEffect(() => {
		channel = client.channel(roomId, { config: { broadcast: { self: true } } });

		channel
			.on("presence", { event: "sync" }, () => {
				initializeTimer();
				const newState = channel.presenceState<{
					card: number;
					userId: string;
				}>();
				const newUsers = Object.values(newState).map(([{ card, userId }]) => ({
					userId,
					card,
				}));
				setUsers(newUsers);

				if (
					autoOpenRef.current &&
					newUsers.length > 0 &&
					newUsers.every((user) => user.card !== undefined)
				) {
					setIsOpen(true);
				}
			})
			.on("broadcast", { event: "open" }, () => {
				setIsOpen(true);
			})
			.on("broadcast", { event: "close" }, () => {
				setIsOpen(false);
			})
			.on("broadcast", { event: "reset" }, async () => {
				setIsOpen(false);
				await channel.track({ card: undefined, userId: userId.current });
			})
			.on("broadcast", { event: "update-auto-open" }, async ({ value }) => {
				autoOpenRef.current = value;
				setAutoOpen(value);
			})
			.on("broadcast", { event: "update-auto-reset" }, async ({ value }) => {
				setAutoReset(value);
			})
			.on("broadcast", { event: "update-note" }, async ({ value }) => {
				setNote(value);
			})
			.subscribe(async (status) => {
				if (status !== "SUBSCRIBED") {
					return;
				}

				await channel.track({ card: undefined, userId: userId.current });
			});

		return () => {
			channel.unsubscribe();
		};
	}, [roomId, initializeTimer]);

	async function selectCard(number: number | undefined) {
		await channel.track({ card: number, userId: userId.current });
	}
	async function unselectCard() {
		selectCard(undefined);
	}

	async function open() {
		await channel.send({ type: "broadcast", event: "open" });
	}

	async function close() {
		await channel.send({ type: "broadcast", event: "close" });
	}

	return {
		selectCard,
		unselectCard,
		users,
		open,
		close,
		isOpen,
		reset,
		get selectedCard() {
			return users.find((user) => user.userId === userId.current)?.card;
		},
		get selectedUsers() {
			return users.filter(
				(user) => user.card !== -1 && user.card !== undefined,
			);
		},
		autoReset,
		changeAutoReset: useCallback(async (value: boolean) => {
			await channel.send({
				type: "broadcast",
				event: "update-auto-reset",
				value,
			});
		}, []),
		changeAutoOpen: useCallback(async (value: boolean) => {
			await channel.send({
				type: "broadcast",
				event: "update-auto-open",
				value,
			});
		}, []),
		autoOpen,
		note,
		changeNote: useCallback(async (value: string) => {
			await channel.send({
				type: "broadcast",
				event: "update-note",
				value,
			});
		}, []),
	};
}
