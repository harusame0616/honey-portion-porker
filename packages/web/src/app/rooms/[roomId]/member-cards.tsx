import { ChevronUpIcon } from "lucide-react";
import { Card } from "./card";
import { motion, AnimatePresence } from "motion/react";

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
			<AnimatePresence initial={false} mode="popLayout">
				{users.length ? (
					users.map(({ userId: memberId, card }) => (
						<motion.li
							key={memberId}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.3 }}
							layout
						>
							<MemberCard
								number={card}
								isOpen={isOpen}
								isMine={memberId === userId}
							/>
						</motion.li>
					))
				) : (
					<motion.li
						key="empty"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						<MemberCard isOpen={false} isMine />
					</motion.li>
				)}
			</AnimatePresence>
		</ul>
	);
}
