"use client";

import type {
	DetailedHTMLProps,
	HTMLAttributes,
	PropsWithChildren,
	ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { updateAutoOpenAction } from "./_actions/update-auto-open-action";
import { updateAutoResetConfigAction } from "./_actions/update-auto-reset-config";
import { ActionCheckbox } from "./action-checkbox";
import { ChoiceCards } from "./choice-cards";
import { MemberCards } from "./member-cards";
import { OwnerOperations } from "./owner-operations";
import { AUTO_OPEN_MINUTES, usePlanningPoker } from "./use-planning-poker";

export function Room({
	roomId,
	ownerRoomId,
	initialAutoReset,
	initialAutoOpen,
}: {
	roomId: string;
	ownerRoomId?: string;
	initialAutoReset: boolean;
	initialAutoOpen: boolean;
}) {
	const {
		users,
		selectedUsers,
		selectedCard,
		selectCard,
		isOpen,
		userId,
		unselectCard,
		open,
		close,
		reset,
		changeAutoReset,
		changeAutoOpen,
		autoOpen,
		autoReset,
	} = usePlanningPoker({
		initialAutoOpen,
		initialAutoReset,
		ownerRoomId,
		roomId,
	});

	return (
		<div className="flex flex-col gap-4">
			<Section title="Your choices">
				<ChoiceCards
					onCardClick={(card) => {
						if (card === selectedCard) {
							unselectCard();
						} else {
							selectCard(card);
						}
					}}
					selectedCard={selectedCard}
				/>
			</Section>

			<Section title="Member's cards">
				<MemberCards isOpen={isOpen} userId={userId.current} users={users} />
			</Section>

			{ownerRoomId && (
				<Section title="Owner operations">
					<OwnerOperations
						isOpen={isOpen}
						onClose={close}
						onOpen={open}
						onReset={reset}
					/>
				</Section>
			)}

			<Section className="text-sm" title="Result">
				<div>
					Average:
					<span className="font-bold">
						{isOpen && selectedUsers.length
							? selectedUsers.reduce((acc, user) => acc + user.card, 0) /
								selectedUsers.length
							: "-"}
					</span>
				</div>
				<div>
					Min:
					<span className="font-bold">
						{isOpen && selectedUsers.length
							? Math.min(...selectedUsers.map((user) => user.card))
							: "-"}
					</span>
				</div>
				<div>
					Max:
					<span className="font-bold">
						{isOpen && selectedUsers.length
							? Math.max(...selectedUsers.map((user) => user.card))
							: "-"}
					</span>
				</div>
			</Section>
			{ownerRoomId && (
				<Section className="flex flex-col gap-2" title="Configures">
					<ActionCheckbox
						action={(checked) =>
							updateAutoResetConfigAction(ownerRoomId, checked)
						}
						checked={autoReset}
						onCheckedChange={changeAutoReset}
					>
						Auto Reset{" "}
						<span className="text-xs text-muted-foreground ml-2">
							（選択肢をオープンしたあと、操作のない時間が {AUTO_OPEN_MINUTES}
							分経過した場合、自動でリセットする）
						</span>
					</ActionCheckbox>
					<ActionCheckbox
						action={(checked) => updateAutoOpenAction(ownerRoomId, checked)}
						checked={autoOpen}
						onCheckedChange={changeAutoOpen}
					>
						Auto Open{" "}
						<span className="text-xs text-muted-foreground ml-2">
							（すべてのユーザーがカードを選択した際に自動でオープンする）
						</span>
					</ActionCheckbox>
				</Section>
			)}
		</div>
	);
}

function Section({
	children,
	title,
	bar,
	className,
	...props
}: PropsWithChildren<{ title: string; bar?: ReactNode }> &
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
	return (
		<section>
			<div className="flex items-end">
				<h2 className="font-bold">{title}</h2>
				<div>{bar}</div>
			</div>
			<div {...props} className={cn("bg-muted p-4 rounded-md", className)}>
				{children}
			</div>
		</section>
	);
}
