import { ChevronUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Card } from "./card";

type MemberCardProps = {
	number?: number;
	isOpen: boolean;
	isMine: boolean;
};

function MemberCard({ number, isOpen, isMine }: MemberCardProps) {
	return (
		<div className="relative">
			<motion.div
				className="relative"
				style={{
					transformStyle: "preserve-3d",
					perspective: "1000px",
					width: "3rem",
					height: "5rem",
				}}
				animate={isOpen ? { rotateY: 0 } : { rotateY: 180 }}
				transition={{
					type: "spring",
					stiffness: 260,
					damping: 20,
				}}
				initial={false}
			>
				<div
					className="absolute inset-0"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(0deg)",
					}}
				>
					<Card isOpen={true} selected={!!number}>
						{number}
					</Card>
				</div>
				<div
					className="absolute inset-0"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<Card isOpen={false} selected={!!number}>
						{null}
					</Card>
				</div>
			</motion.div>
			{isMine && (
				<motion.div
					className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
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
