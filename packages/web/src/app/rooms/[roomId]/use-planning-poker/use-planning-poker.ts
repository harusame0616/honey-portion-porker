import { useCallback, useEffect, useRef, useState } from "react";
import { v7 as uuid } from "uuid";
import { useTimer } from "../use-timer";
import { useChannel } from "./use-cannel";
import { useConfig } from "./use-config";
import { useRealtimeCommand } from "./use-realtime-command";
import { useRealtimeListener } from "./use-realtime-listener";
import { useUsers } from "./use-users";

type Params = {
	roomId: string;
	ownerRoomId?: string;
	initialAutoReset: boolean;
	initialAutoOpen: boolean;
	initialNote: string;
};

export const AUTO_OPEN_MINUTES = 1;

export function usePlanningPoker({
	roomId,
	ownerRoomId,
	initialAutoReset,
	initialAutoOpen,
	initialNote,
}: Params) {
	const userId = useRef<string>(uuid());
	const { users, setUsers, selectedUsers, selectedCard } = useUsers(
		userId.current,
	);
	const [isOpen, setIsOpen] = useState(false);
	const { autoReset, autoOpen, setAutoReset, setAutoOpen, autoOpenRef } =
		useConfig(initialAutoReset, initialAutoOpen);
	const [note, setNote] = useState(initialNote);
	const channel = useChannel(roomId);
	const realtimeCommand = useRealtimeCommand(channel, userId.current);

	const { startTimer, stopTimer, initializeTimer } = useTimer(
		1000 * 60 * AUTO_OPEN_MINUTES,
		realtimeCommand.reset,
	);

	useRealtimeListener(channel, {
		onPresenceChange: useCallback(
			(users) => {
				setUsers(users);

				initializeTimer();
				if (
					autoOpenRef.current &&
					users.length > 0 &&
					users.every((user) => user.card !== undefined)
				) {
					setIsOpen(true);
				}
			},
			[setUsers, initializeTimer, autoOpenRef],
		),
		onOpen: useCallback(() => setIsOpen(true), []),
		onClose: useCallback(() => setIsOpen(false), []),
		onReset: useCallback(() => {
			setIsOpen(false);
			realtimeCommand.unselectCard();
		}, [realtimeCommand.unselectCard]),
		onUpdateAutoOpen: useCallback(setAutoOpen, []),
		onUpdateAutoReset: useCallback(setAutoReset, []),
		onUpdateNote: useCallback(setNote, []),
		onSubscribe: useCallback(() => {
			realtimeCommand.unselectCard();
		}, [realtimeCommand.unselectCard]),
	});

	useEffect(() => {
		if (!ownerRoomId || !isOpen || !autoReset) {
			return;
		}

		startTimer();
		return stopTimer;
	}, [autoReset, stopTimer, startTimer, ownerRoomId, isOpen]);

	return {
		...realtimeCommand,
		users,
		isOpen,
		selectedUsers,
		selectedCard,
		autoReset,
		autoOpen,
		note,
		userId,
		changeAutoReset: useCallback(
			async (checked: boolean) => {
				setAutoReset(checked);
				await realtimeCommand.changeAutoReset(checked);
			},
			[realtimeCommand.changeAutoReset, setAutoReset],
		),
		changeAutoOpen: useCallback(
			async (checked: boolean) => {
				setAutoOpen(checked);
				await realtimeCommand.changeAutoOpen(checked);
			},
			[realtimeCommand.changeAutoOpen, setAutoOpen],
		),
	};
}
