import { useCallback, useEffect, useRef } from "react";
import { useStateWithRef } from "./use-planning-poker/use-state-with-ref";

type UseTimer = {
	startTimer: () => void;
	stopTimer: () => void;
	initializeTimer: () => void;
};

export function useTimer(time: number, onTimeUp: () => void): UseTimer {
	const [isActive, setIsActive, isActiveRef] = useStateWithRef(false);
	const timerIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const startTimer = useCallback(() => {
		setIsActive(true);
	}, [setIsActive]);

	const stopTimer = useCallback(() => {
		setIsActive(false);
	}, [setIsActive]);

	const initializeTimer = useCallback(() => {
		clearInterval(timerIdRef.current);

		if (!isActiveRef.current) {
			return;
		}

		timerIdRef.current = setInterval(() => {
			onTimeUp();
		}, time);
	}, [onTimeUp, time, isActiveRef]);

	useEffect(() => {
		if (!isActive) {
			return;
		}

		initializeTimer();
		return () => {
			clearInterval(timerIdRef.current);
			timerIdRef.current = undefined;
		};
	}, [isActive, initializeTimer]);

	return {
		initializeTimer,
		startTimer,
		stopTimer,
	};
}
