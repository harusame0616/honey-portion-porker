import type { Result } from "@harusame0616/result";
import { CheckIcon, LoaderIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { LabeledCheckbox } from "@/components/labeled-checkbox";
import { useOptimisticCheckbox } from "./use-optimistic-checkbox";

type Props = {
	checked: boolean;
	onCheckedChange: (checked: boolean) => Promise<void>;
	action: (checked: boolean) => Promise<Result<void, string>>;
};

export function ActionCheckbox({
	onCheckedChange,
	checked,
	action,
	children,
}: PropsWithChildren<Props>) {
	const { isPending, changeChecked, optimisticCheckedState, isFinished } =
		useOptimisticCheckbox({
			action,
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
			{children}{" "}
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
		</LabeledCheckbox>
	);
}
