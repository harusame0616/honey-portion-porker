import { CheckIcon, LoaderIcon } from "lucide-react";
import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { updateAutoResetConfigAction } from "./_actions/update-auto-reset-config";
import { useOptimisticCheckbox } from "./use-optimistic-checkbox";
import { AUTO_OPEN_MINUTES } from "./use-planning-poker";

type props = {
	ownerRoomId: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => Promise<void>;
};
export function AutoResetCheckbox({
	ownerRoomId,
	onCheckedChange,
	checked,
}: props) {
	const { isPending, changeChecked, optimisticCheckedState, isFinished } =
		useOptimisticCheckbox({
			action: async (checked: boolean) => {
				return await updateAutoResetConfigAction(ownerRoomId, checked);
			},
			checked,
			onCheckedChange,
		});

	return (
		<LabeledCheckbox
			aria-live="polite"
			checked={optimisticCheckedState}
			className="text-sm"
			disabled={isPending}
			onCheckedChange={(checked) => {
				changeChecked(checked === true);
			}}
		>
			Auto Reset{" "}
			{isPending && !isFinished && (
				<LoaderIcon
					aria-label="saving"
					className="animate-spin size-4 ml-2"
					role="img"
				/>
			)}
			{isFinished && (
				<CheckIcon
					aria-label="saved"
					className="size-4 ml-2 text-green-600 font-bold"
					role="img"
					strokeWidth={4}
				/>
			)}
			<span className="text-xs text-muted-foreground ml-2">
				（選択肢をオープンしたあと、操作のない時間が {AUTO_OPEN_MINUTES}
				分経過した場合、自動でリセットする）
			</span>
		</LabeledCheckbox>
	);
}
