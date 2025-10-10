"use client";
import { CheckIcon } from "lucide-react";
import {
	type ComponentProps,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";
import { Button } from "@/components/ui/button";

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
			onClick={(event) => {
				onClick?.(event);
				setIsFinished(true);
			}}
			size="icon"
			type="button"
			variant="ghost"
			{...props}
		>
			{isFinished ? (
				<CheckIcon aria-label="copied" className="text-primary" role="img" />
			) : (
				children
			)}
		</Button>
	);
}
