import { useOptimistic, useTransition } from "react";
import { useTimerFinished } from "./use-timer-finished";

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
	const { isFinished, finish, reset } = useTimerFinished();

	const [optimisticCheckedState, setOptimisticCheckedState] =
		useOptimistic(checked);

	function changeChecked(checked: boolean) {
		startTransition(async () => {
			reset();
			setOptimisticCheckedState(checked);

			await action(checked);

			await onCheckedChange(checked);
			finish();
		});
	}

	return {
		changeChecked,
		isFinished,
		isPending,
		optimisticCheckedState,
	};
}
