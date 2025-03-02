import { useCallback, useEffect, useRef, useState } from "react";

type UseTimer = {
	startTimer: () => void;
	stopTimer: () => void;
	initializeTimer: () => void;
};

export function useTimer(time: number, onTimeUp: () => void): UseTimer {
	const [isActive, setIsActive] = useState(false);
	const timerIdRef = useRef<NodeJS.Timeout | undefined>();

	const startTimer = useCallback(() => {
		setIsActive(true);
	}, []);

	const stopTimer = useCallback(() => {
		setIsActive(false);
	}, []);

	const initializeTimer = useCallback(() => {
		if (!isActive) {
			return;
		}

		clearInterval(timerIdRef.current);
		timerIdRef.current = setInterval(() => {
			onTimeUp();
		}, time);
	}, [onTimeUp, time, isActive]);

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
		startTimer,
		stopTimer,
		initializeTimer,
	};
}
