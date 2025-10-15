import { Button } from "@/components/ui/button";

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
				<Button className="font-bold w-20" onClick={onClose} type="button">
					CLOSE
				</Button>
			) : (
				<Button className="font-bold w-20" onClick={onOpen} type="button">
					OPEN
				</Button>
			)}
			<Button
				className="font-bold"
				onClick={onReset}
				type="button"
				variant="outline"
			>
				RESET
			</Button>
		</div>
	);
}
