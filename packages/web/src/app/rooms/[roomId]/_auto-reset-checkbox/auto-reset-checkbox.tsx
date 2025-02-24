import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AUTO_OPEN_MINUTES } from "../use-planning-poker";
import { useAutoResetSaving } from "./use-auto-reset-saving";

type props = {
	ownerRoomId: string;
	autoReset: boolean;
	onChangedAutoReset: (newNote: boolean) => void;
};
export function AutoResetCheckbox({
	ownerRoomId,
	onChangedAutoReset,
	autoReset,
}: props) {
	const [isFinished, setIsFinished] = useState(false);

	const { isPending, toggleAutoReset, optimisticAutoReset } =
		useAutoResetSaving({
			ownerRoomId,
			autoReset,
			onSave: async (newAutoReset) => {
				setIsFinished(true);
				onChangedAutoReset(newAutoReset);
			},
		});

	useEffect(() => {
		if (!isFinished) {
			return;
		}

		const timeoutId = setTimeout(() => {
			setIsFinished(false);
		}, 500);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [isFinished]);

	return (
		<LabeledCheckbox
			onCheckedChange={() => {
				setIsFinished(false);
				toggleAutoReset();
			}}
			checked={optimisticAutoReset}
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
