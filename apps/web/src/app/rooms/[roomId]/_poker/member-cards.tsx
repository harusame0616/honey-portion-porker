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
				animate={isOpen ? { rotateY: 0 } : { rotateY: 180 }}
				className="relative"
				initial={false}
				style={{
					height: "5rem",
					perspective: "1000px",
					transformStyle: "preserve-3d",
					width: "3rem",
				}}
				transition={{
					damping: 20,
					stiffness: 260,
					type: "spring",
				}}
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
					animate={{ y: [0, -5, 0] }}
					className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
					initial={{ y: 0 }}
					transition={{
						duration: 0.6,
						ease: "easeInOut",
						repeat: 1,
						repeatDelay: 2,
					}}
				>
					<ChevronUpIcon aria-label="you" role="img" />
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
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							initial={{ opacity: 0, scale: 0.8 }}
							key={memberId}
							layout
							transition={{ duration: 0.3 }}
						>
							<MemberCard
								isMine={memberId === userId}
								isOpen={isOpen}
								number={card}
							/>
						</motion.li>
					))
				) : (
					<motion.li
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						initial={{ opacity: 0, scale: 0.8 }}
						key="empty"
						transition={{ duration: 0.3 }}
					>
						<MemberCard isMine isOpen={false} />
					</motion.li>
				)}
			</AnimatePresence>
		</ul>
	);
}
