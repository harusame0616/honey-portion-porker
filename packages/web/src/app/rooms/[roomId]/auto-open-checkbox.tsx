import { CheckIcon, LoaderIcon } from "lucide-react";
import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { updateAutoOpenAction } from "./_actions/update-auto-open-action";
import { useOptimisticCheckbox } from "./use-optimistic-checkbox";

type Props = {
	ownerRoomId: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => Promise<void>;
};
export function AutoOpenCheckbox({
	ownerRoomId,
	onCheckedChange,
	checked,
}: Props) {
	const { isPending, changeChecked, optimisticCheckedState, isFinished } =
		useOptimisticCheckbox({
			action: async (checked: boolean) => {
				await updateAutoOpenAction(ownerRoomId, checked);
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
			Auto Open{" "}
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
				（すべてのユーザーがカードを選択した際に自動でオープンする）
			</span>
		</LabeledCheckbox>
	);
}
