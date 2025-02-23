"use client";
import { ClipboardIcon } from "lucide-react";
import { ReactionIconButton } from "./reaction-icon-button";

type Props = {
  text: string;
};
export function CopyButton({ text }: Props) {
  return (
    <ReactionIconButton
      variant="ghost"
      size="icon"
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
      aria-live="polite"
    >
      <ClipboardIcon role="img" aria-label="copy" />
    </ReactionIconButton>
  );
}
