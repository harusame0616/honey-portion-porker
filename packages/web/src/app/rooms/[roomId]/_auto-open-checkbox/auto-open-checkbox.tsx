import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAutoOpenSaving } from "./use-auto-open-saving";

type Props = {
	ownerRoomId: string;
	autoOpen: boolean;
	onChangedAutoReset: (newNote: boolean) => void;
};
export function AutoOpenCheckbox({
	ownerRoomId,
	onChangedAutoReset,
	autoOpen,
}: Props) {
	const [isFinished, setIsFinished] = useState(false);

	const {
		isPending,
		toggleAutoOpen: toggleAutoReset,
		optimisticAutoOpen: optimisticAutoReset,
	} = useAutoOpenSaving({
		ownerRoomId,
		autoOpen: autoOpen,
		onSave: async (newAutoReset) => {
			setIsFinished(true);
			onChangedAutoReset(newAutoReset);
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsFinished(false);
		}, 1000);
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
