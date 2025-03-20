import { Card } from "./card";
import { motion } from "motion/react";

const choices = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, -1];

type Props = {
	selectedCard: number | undefined;
	onCardClick: (card: number) => void;
};
export function ChoiceCards({ onCardClick, selectedCard }: Props) {
	return (
		<ul className="flex flex-wrap gap-4">
			{choices.map((card) => (
				<li key={card}>
					<motion.button
						type="button"
						onClick={() => onCardClick(card)}
						key={card}
						whileHover={{
							scale: 1.05,
							transition: { duration: 0.2 },
						}}
						whileTap={{
							scale: 0.95,
							transition: { duration: 0.1 },
						}}
						initial={{ scale: 1 }}
						animate={card === selectedCard ? { y: -10 } : { y: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
					>
						<Card isOpen selected={card === selectedCard}>
							{card}
						</Card>
					</motion.button>
				</li>
			))}
		</ul>
	);
}
