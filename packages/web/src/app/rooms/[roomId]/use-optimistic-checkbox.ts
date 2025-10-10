import { useOptimistic, useTransition } from "react";

type Params = {
	checked: boolean;
	onCheckedChange: (newChecked: boolean) => Promise<void>;
	action: (newChecked: boolean) => Promise<void>;
};

export function useOptimisticCheckbox({
	onCheckedChange,
	checked,
	action,
}: Params) {
	const [isPending, startTransition] = useTransition();

	const [optimisticCheckedState, setOptimisticCheckedState] =
		useOptimistic(checked);

	function changeChecked(checked: boolean) {
		startTransition(async () => {
			setOptimisticCheckedState(checked);

			await action(checked);

			await onCheckedChange(checked);
		});
	}

	return {
		changeChecked,
		isPending,
		optimisticCheckedState,
	};
}
