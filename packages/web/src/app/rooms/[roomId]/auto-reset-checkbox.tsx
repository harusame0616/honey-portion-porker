import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AUTO_OPEN_MINUTES } from "./use-planning-poker";
import { useOptimisticCheckbox } from "./use-optimistic-checkbox";
import { updateAutoResetConfigAction } from "./_actions/update-auto-reset-config";
import { useTimerFinished } from "./use-timer-finished";

type props = {
	ownerRoomId: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
};
export function AutoResetCheckbox({
	ownerRoomId,
	onCheckedChange,
	checked,
}: props) {
	const { isFinished, finish, reset } = useTimerFinished();
	const { isPending, changeChecked, optimisticCheckedState } =
		useOptimisticCheckbox({
			checked,
			action: async (checked: boolean) => {
				reset();
				const result = await updateAutoResetConfigAction(ownerRoomId, checked);
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
			Auto Reset{" "}
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
				（選択肢をオープンしたあと、操作のない時間が {AUTO_OPEN_MINUTES}
				分経過した場合、自動でリセットする）
			</span>
		</LabeledCheckbox>
	);
}
