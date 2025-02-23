"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import {
	type ComponentProps,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";

type Props = ComponentProps<typeof Button>;
export function ReactionIconButton({
	children,
	onClick,
	...props
}: PropsWithChildren<Props>) {
	const [isFinished, setIsFinished] = useState(false);

	useEffect(() => {
		if (isFinished) {
			const timer = setTimeout(() => {
				setIsFinished(false);
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [isFinished]);

	return (
		<Button
			size="icon"
			variant="ghost"
			type="button"
			onClick={(event) => {
				onClick?.(event);
				setIsFinished(true);
			}}
			{...props}
		>
			{isFinished ? (
				<CheckIcon role="img" aria-label="copied" className="text-primary" />
			) : (
				children
			)}
		</Button>
	);
}
