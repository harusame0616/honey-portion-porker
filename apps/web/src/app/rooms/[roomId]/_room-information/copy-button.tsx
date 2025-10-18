"use client";
import { ClipboardIcon } from "lucide-react";
import { ReactionIconButton } from "./reaction-icon-button";

type Props = {
	text: string;
};
export function CopyButton({ text }: Props) {
	return (
		<ReactionIconButton
			aria-live="polite"
			onClick={() => {
				navigator.clipboard.writeText(text);
			}}
			size="icon"
			type="button"
			variant="ghost"
		>
			<ClipboardIcon aria-label="copy" role="img" />
		</ReactionIconButton>
	);
}
