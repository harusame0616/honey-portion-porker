import { motion } from "motion/react";
import { Card } from "./card";

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
						animate={card === selectedCard ? { y: -10 } : { y: 0 }}
						initial={{ scale: 1 }}
						key={card}
						onClick={() => onCardClick(card)}
						transition={{ damping: 20, stiffness: 300, type: "spring" }}
						type="button"
						whileHover={{
							scale: 1.05,
							transition: { duration: 0.2 },
						}}
						whileTap={{
							scale: 0.95,
							transition: { duration: 0.1 },
						}}
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
