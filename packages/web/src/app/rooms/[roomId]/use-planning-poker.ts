import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Params = {
	roomId: string;
	ownerRoomId?: string;
	autoReset: boolean;
	autoOpen: boolean;
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
	autoReset,
	autoOpen,
}: Params) {
	const userId = useRef<string>(window.crypto.randomUUID());
	const [users, setUsers] = useState<{ card: number; userId: string }[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const router = useRouter();
	const [lastOperationDatetime, setLastOperationDatetime] = useState<number>(
		Date.now(),
	);

	function updateLastOperationDatetime() {
		setLastOperationDatetime(Date.now());
	}

	async function reset() {
		await channel.send({ type: "broadcast", event: "reset" });
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeoutId = setTimeout(
			() => {
				if (autoReset && ownerRoomId && isOpen) {
					reset();
				}
			},
			1000 * 60 * AUTO_OPEN_MINUTES,
		);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [autoReset, isOpen, lastOperationDatetime, ownerRoomId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (
			ownerRoomId &&
			!isOpen &&
			autoOpen &&
			users.length > 1 &&
			users.filter((user) => user.card !== -1 && user.card !== undefined)
				.length === users.length
		) {
			open();
		}
	}, [users]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		channel = client.channel(roomId, { config: { broadcast: { self: true } } });

		channel
			.on("presence", { event: "sync" }, () => {
				updateLastOperationDatetime();
				const newState = channel.presenceState<{
					card: number;
					userId: string;
				}>();
				setUsers(
					Object.values(newState).map(([{ card, userId }]) => ({
						userId,
						card,
					})),
				);
			})
			.on("broadcast", { event: "open" }, () => {
				updateLastOperationDatetime();
				setIsOpen(true);
			})
			.on("broadcast", { event: "close" }, () => {
				updateLastOperationDatetime();
				setIsOpen(false);
			})
			.on("broadcast", { event: "reset" }, async () => {
				setIsOpen(false);
				await channel.track({ card: undefined, userId: userId.current });
			})
			.on("broadcast", { event: "refresh" }, async () => {
				router.refresh();
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
	}, [roomId, router]);

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
		updateLastOperationDatetime() {
			setLastOperationDatetime(Date.now());
		},
		async refresh() {
			await channel.send({ type: "broadcast", event: "refresh" });
		},
	};
}
