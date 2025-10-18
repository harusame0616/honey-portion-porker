import { useState } from "react";
import { useStateWithRef } from "./use-state-with-ref";

export function useConfig(initialAutoReset: boolean, initialAutoOpen: boolean) {
	const [autoReset, setAutoReset] = useState(initialAutoReset);
	const [autoOpen, setAutoOpen, autoOpenRef] = useStateWithRef(initialAutoOpen);

	return {
		autoOpen,
		autoOpenRef,
		autoReset,
		setAutoOpen,
		setAutoReset,
	};
}
