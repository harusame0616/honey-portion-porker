import { useEffect, useOptimistic, useState, useTransition } from "react";
import { updateAutoResetConfigAction } from "./_actions/update-auto-reset-config";

type Params = {
	checked: boolean;
	onCheckedChange: (newAutoReset: boolean) => void;
	action: (newChecked: boolean) => Promise<void>;
};

export function useOptimisticCheckbox({
	onCheckedChange,
	checked,
	action,
}: Params) {
	const [isPending, startTransition] = useTransition();

	const [checkedState, setCheckedState] = useState(checked);
	const [optimisticCheckedState, setOptimisticCheckedState] =
		useOptimistic(checkedState);

	useEffect(() => {
		setCheckedState(checked);
	}, [checked]);

	function changeChecked(checked: boolean) {
		startTransition(async () => {
			setOptimisticCheckedState(checked);

			await action(checked);

			setCheckedState(checked);
			onCheckedChange(checked);
		});
	}

	return {
		isPending,
		optimisticCheckedState,
		changeChecked,
	};
}
