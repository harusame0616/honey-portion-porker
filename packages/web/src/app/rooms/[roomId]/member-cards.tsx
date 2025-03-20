import { ChevronUpIcon } from "lucide-react";
import { Card } from "./card";
import { motion } from "motion/react";

type MemberCardProps = {
	number?: number;
	isOpen: boolean;
	isMine: boolean;
};

function MemberCard({ number, isOpen, isMine }: MemberCardProps) {
	return (
		<motion.div
			className="flex flex-col items-center relative"
			animate={isOpen ? { rotateY: 0 } : { rotateY: 180 }}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
				duration: 0.5,
			}}
			initial={false}
		>
			<Card isOpen={isOpen} selected={!!number}>
				{number}
			</Card>
			{isMine && (
				<motion.div
					className="-ml-0.5 -mt-1.5 -mb-4"
					initial={{ y: 0 }}
					animate={{ y: [0, -5, 0] }}
					transition={{
						repeat: 1,
						duration: 0.6,
						ease: "easeInOut",
						repeatDelay: 2,
					}}
				>
					<ChevronUpIcon role="img" aria-label="you" />
				</motion.div>
			)}
		</motion.div>
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
