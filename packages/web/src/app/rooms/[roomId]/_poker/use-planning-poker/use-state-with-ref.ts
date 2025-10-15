import { useCallback, useRef, useState } from "react";

export function useStateWithRef<T>(
	initialValue: T,
): [T, (value: T) => void, React.MutableRefObject<T>] {
	const [state, setState] = useState<T>(initialValue);
	const ref = useRef<T>(initialValue);

	return [
		state,
		useCallback((value: T) => {
			setState(value);
			ref.current = value;
		}, []),
		ref,
	];
}
