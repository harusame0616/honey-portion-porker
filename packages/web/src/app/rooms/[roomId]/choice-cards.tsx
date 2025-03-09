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
					<button type="button" onClick={() => onCardClick(card)} key={card}>
						<Card isOpen selected={card === selectedCard}>
							{card}
						</Card>
					</button>
				</li>
			))}
		</ul>
	);
}
