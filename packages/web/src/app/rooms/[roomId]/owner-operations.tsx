import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type Props = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onReset: () => void;
};

export function OwnerOperations({ isOpen, onOpen, onClose, onReset }: Props) {
	return (
		<div className="flex gap-4">
			{isOpen ? (
				<Button type="button" onClick={onClose} className="font-bold w-20">
					CLOSE
				</Button>
			) : (
				<Button type="button" onClick={onOpen} className="font-bold w-20">
					OPEN
				</Button>
			)}
			<Button
				type="button"
				variant="outline"
				onClick={onReset}
				className="font-bold"
			>
				RESET
			</Button>
		</div>
	);
}
