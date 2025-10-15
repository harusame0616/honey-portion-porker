import { useCallback, useEffect, useRef, useState } from "react";
import { v7 as uuid } from "uuid";
import { useTimer } from "../use-timer";
import { useChannel } from "./use-cannel";
import { useConfig } from "./use-config";
import { useRealtimeCommand } from "./use-realtime-command";
import { useRealtimeListener } from "./use-realtime-listener";
import { useUsers } from "./use-users";

type Params = {
	memberRoomId: string;
	ownerRoomId?: string;
	initialAutoReset: boolean;
	initialAutoOpen: boolean;
};

export const AUTO_OPEN_MINUTES = 1;

export function usePlanningPoker({
	memberRoomId,
	ownerRoomId,
	initialAutoReset,
	initialAutoOpen,
}: Params) {
	const userId = useRef<string>(uuid());
	const { users, setUsers, selectedUsers, selectedCard } = useUsers(
		userId.current,
	);
	const [isOpen, setIsOpen] = useState(false);
	const { autoReset, autoOpen, setAutoReset, setAutoOpen, autoOpenRef } =
		useConfig(initialAutoReset, initialAutoOpen);
	const channel = useChannel(memberRoomId);
	const realtimeCommand = useRealtimeCommand(channel, userId.current);

	const { startTimer, stopTimer, initializeTimer } = useTimer(
		1000 * 60 * AUTO_OPEN_MINUTES,
		realtimeCommand.reset,
	);

	useRealtimeListener(channel, {
		onClose: useCallback(() => setIsOpen(false), []),
		onOpen: useCallback(() => setIsOpen(true), []),
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
		onReset: useCallback(() => {
			setIsOpen(false);
			realtimeCommand.unselectCard();
		}, [realtimeCommand.unselectCard]),
		onSubscribe: useCallback(() => {
			realtimeCommand.unselectCard();
		}, [realtimeCommand.unselectCard]),
		onUpdateAutoOpen: useCallback(setAutoOpen, []),
		onUpdateAutoReset: useCallback(setAutoReset, []),
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
		autoOpen,
		autoReset,
		changeAutoOpen: useCallback(
			async (checked: boolean) => {
				setAutoOpen(checked);
				await realtimeCommand.changeAutoOpen(checked);
			},
			[realtimeCommand.changeAutoOpen, setAutoOpen],
		),
		changeAutoReset: useCallback(
			async (checked: boolean) => {
				setAutoReset(checked);
				await realtimeCommand.changeAutoReset(checked);
			},
			[realtimeCommand.changeAutoReset, setAutoReset],
		),
		isOpen,
		selectedCard,
		selectedUsers,
		userId,
		users,
	};
}
