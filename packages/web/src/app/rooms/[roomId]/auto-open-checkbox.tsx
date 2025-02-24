import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useOptimisticCheckbox } from "./use-optimistic-checkbox";
import { updateAutoOpenAction } from "./_actions/update-auto-open-action";
import { useTimerFinished } from "./use-timer-finished";

type Props = {
	ownerRoomId: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
};
export function AutoOpenCheckbox({
	ownerRoomId,
	onCheckedChange,
	checked,
}: Props) {
	const { isFinished, finish, reset } = useTimerFinished();
	const { isPending, changeChecked, optimisticCheckedState } =
		useOptimisticCheckbox({
			checked,
			action: async (checked: boolean) => {
				reset();
				const result = await updateAutoOpenAction(ownerRoomId, checked);
				if (!result.success) {
					return;
				}
				finish();
			},
			onCheckedChange,
		});

	return (
		<LabeledCheckbox
			onCheckedChange={(checked) => {
				changeChecked(checked === true);
			}}
			checked={optimisticCheckedState}
			className="text-sm"
			disabled={isPending}
			aria-live="polite"
		>
			Auto Open{" "}
			{isPending && !isFinished && (
				<LoaderIcon
					className="animate-spin size-4 ml-2"
					role="img"
					aria-label="saving"
				/>
			)}
			{isFinished && (
				<CheckIcon
					className="size-4 ml-2 text-green-600 font-bold"
					strokeWidth={4}
					role="img"
					aria-label="saved"
				/>
			)}
			<span className="text-xs text-muted-foreground ml-2">
				（すべてのユーザーがカードを選択した際に自動でオープンする）
			</span>
		</LabeledCheckbox>
	);
}
