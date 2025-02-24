import { useEffect, useOptimistic, useState, useTransition } from "react";
import { updateAutoResetConfigAction } from "../_actions/update-auto-reset-config";

type Params = {
	ownerRoomId: string;
	autoReset: boolean;
	onSave: (newAutoReset: boolean) => Promise<void>;
};

export function useAutoResetSaving({ onSave, autoReset, ownerRoomId }: Params) {
	const [isPending, startTransition] = useTransition();

	const [autoResetState, setAutoResetState] = useState(autoReset);
	const [optimisticAutoReset, setOptimisticAutoReset] =
		useOptimistic(autoResetState);

	useEffect(() => {
		setAutoResetState(autoReset);
	}, [autoReset]);

	function toggleAutoReset() {
		startTransition(async () => {
			const newAutoReset = !autoResetState;
			setOptimisticAutoReset(newAutoReset);
			const result = await updateAutoResetConfigAction(
				ownerRoomId,
				newAutoReset,
			);
			if (!result.success) {
				return;
			}
			setAutoResetState(newAutoReset);
			onSave(newAutoReset);
		});
	}

	return {
		isPending,
		optimisticAutoReset,
		toggleAutoReset,
	};
}
