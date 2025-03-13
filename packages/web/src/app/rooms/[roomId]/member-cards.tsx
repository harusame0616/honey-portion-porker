import { ChevronUpIcon } from "lucide-react";
import { Card } from "./card";

type MemberCardProps = {
	number?: number;
	isOpen: boolean;
	isMine: boolean;
};

function MemberCard({ number, isOpen, isMine }: MemberCardProps) {
	return (
		<div className="flex flex-col items-center relative">
			<Card isOpen={isOpen} selected={!!number}>
				{number}
			</Card>
			{isMine && (
				<div className="-ml-0.5 -mt-1.5 -mb-4">
					<ChevronUpIcon role="img" aria-label="you" />
				</div>
			)}
		</div>
	);
}

type Props = {
	users: {
		userId: string;
		card: number;
	}[];
	isOpen: boolean;
	userId: string;
};

export function MemberCards({ users, isOpen, userId }: Props) {
	return (
		<ul className="flex gap-4 flex-wrap">
			{users.length ? (
				users.map(({ userId: memberId, card }) => (
					<li key={memberId}>
						<MemberCard
							number={card}
							isOpen={isOpen}
							isMine={memberId === userId}
						/>
					</li>
				))
			) : (
				<li>
					<MemberCard isOpen={false} isMine />
				</li>
			)}
		</ul>
	);
}
