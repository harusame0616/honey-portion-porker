import { useOptimistic, useTransition } from "react";
import { updateAutoResetConfigAction } from "../_actions/update-auto-reset-config";

type Params = {
	ownerRoomId: string;
	autoReset: boolean;
	onSave: (newAutoReset: boolean) => Promise<void>;
};

export function useAutoResetSaving({ onSave, autoReset, ownerRoomId }: Params) {
	const [isPending, startTransition] = useTransition();

	const [optimisticAutoReset, setOptimisticAutoReset] =
		useOptimistic(autoReset);

	function toggleAutoReset() {
		startTransition(async () => {
			const newAutoReset = !autoReset;
			setOptimisticAutoReset(!optimisticAutoReset);
			const result = await updateAutoResetConfigAction(
				ownerRoomId,
				newAutoReset,
			);
			if (!result.success) {
				return;
			}
			onSave(newAutoReset);
		});
	}

	return {
		isPending,
		optimisticAutoReset,
		toggleAutoReset,
	};
}
