import { useEffect, useOptimistic, useState, useTransition } from "react";
import { updateAutoOpenAction } from "./update-auto-open-action";

type Params = {
	ownerRoomId: string;
	autoOpen: boolean;
	onSave: (newAutoReset: boolean) => Promise<void>;
};

export function useAutoOpenSaving({ onSave, autoOpen, ownerRoomId }: Params) {
	const [autoOpenState, setAutoOpenState] = useState(autoOpen);
	const [optimisticAutoOpen, setOptimisticAutoOpen] =
		useOptimistic(autoOpenState);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setAutoOpenState(autoOpen);
	}, [autoOpen]);

	function toggleAutoOpen() {
		startTransition(async () => {
			const newAutoOpen = !autoOpenState;
			setOptimisticAutoOpen(newAutoOpen);
			const result = await updateAutoOpenAction(ownerRoomId, newAutoOpen);
			if (!result.success) {
				return;
			}
			setAutoOpenState(newAutoOpen);
			onSave(newAutoOpen);
		});
	}

	return {
		isPending,
		optimisticAutoOpen,
		toggleAutoOpen,
	};
}
