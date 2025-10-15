"use client";

import { Section } from "@/components/section";
import { ActionCheckbox } from "./action-checkbox";
import { ChoiceCards } from "./choice-cards";
import { MemberCards } from "./member-cards";
import { OwnerOperations } from "./owner-operations";
import { updateAutoOpenAction } from "./update-auto-open-action";
import { updateAutoResetConfigAction } from "./update-auto-reset-config";
import { AUTO_OPEN_MINUTES, usePlanningPoker } from "./use-planning-poker";

export function PokerPresenter({
	memberRoomId,
	ownerRoomId,
	initialAutoReset,
	initialAutoOpen,
}: {
	memberRoomId: string;
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
		memberRoomId,
		ownerRoomId,
	});

	return (
		<>
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
		</>
	);
}
