import { useEffect, useState } from "react";

export function useTimerFinished() {
	const [isFinished, setIsFinished] = useState(false);

	useEffect(() => {
		if (!isFinished) {
			return;
		}

		const timeoutId = setTimeout(() => {
			setIsFinished(false);
		}, 500);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [isFinished]);

	return {
		isFinished,
		finish: () => {
			setIsFinished(true);
		},
		reset: () => {
			setIsFinished(false);
		},
	};
}
