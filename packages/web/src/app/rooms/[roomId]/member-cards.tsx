import { ChevronUpIcon } from "lucide-react";
import { Card } from "./card";

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
				users.map((user) => (
					<li key={user.userId}>
						<div className="flex flex-col items-center relative">
							<Card isOpen={isOpen} selected={!!user.card} key={user.userId}>
								{user.card}
							</Card>
							{user.userId === userId && (
								<div className="-ml-0.5 -mt-1.5 -mb-4">
									<ChevronUpIcon role="img" aria-label="you" />
								</div>
							)}
						</div>
					</li>
				))
			) : (
				<Card isOpen={false} selected={false} />
			)}
		</ul>
	);
}
