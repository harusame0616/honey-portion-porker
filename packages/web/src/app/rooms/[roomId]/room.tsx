"use client";

import { EditIcon } from "lucide-react";
import Form from "next/form";
import {
	type DetailedHTMLProps,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactNode,
	useActionState,
	useEffect,
	useId,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { editNoteAction } from "./_actions/edit-note-action";
import { AutoOpenCheckbox } from "./auto-open-checkbox";
import { AutoResetCheckbox } from "./auto-reset-checkbox";
import { ChoiceCards } from "./choice-cards";
import { CopyButton } from "./copy-button";
import { MemberCards } from "./member-cards";
import { OwnerOperations } from "./owner-operations";
import { usePlanningPoker } from "./use-planning-poker";

export function Room({
	roomId,
	initialNote,
	ownerRoomId,
	memberRoomId,
	initialAutoReset,
	initialAutoOpen,
}: {
	roomId: string;
	initialNote: string;
	ownerRoomId?: string;
	memberRoomId: string;
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
		note,
		changeNote,
	} = usePlanningPoker({
		initialAutoOpen,
		initialAutoReset,
		initialNote,
		ownerRoomId,
		roomId,
	});
	const [isNoteEditing, setIsNoteEditing] = useState(false);

	const memberRoomIdInputId = useId();
	const memberRoomUrlInputId = useId();

	return (
		<div className="flex flex-col gap-4">
			<Section
				bar={
					ownerRoomId && (
						<div className="-mb-[6px]">
							<Button
								onClick={() => setIsNoteEditing((prev) => !prev)}
								size="icon"
								type="button"
								variant="ghost"
							>
								<EditIcon />
							</Button>
						</div>
					)
				}
				title="Note"
			>
				{ownerRoomId && isNoteEditing ? (
					<NoteEditionForm
						key={note}
						note={note}
						onSubmit={async (newNote) => {
							changeNote(newNote);
							setIsNoteEditing(false);
						}}
						ownerRoomId={ownerRoomId}
					/>
				) : (
					<p className="whitespace-pre-wrap break-all">{note || "-"}</p>
				)}
			</Section>

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
					<AutoResetCheckbox
						checked={autoReset}
						onCheckedChange={changeAutoReset}
						ownerRoomId={ownerRoomId}
					/>
					<AutoOpenCheckbox
						checked={autoOpen}
						onCheckedChange={changeAutoOpen}
						ownerRoomId={ownerRoomId}
					/>
				</Section>
			)}

			<Section className="flex flex-col gap-2" title="Room information">
				<div>
					<label className="text-sm" htmlFor={memberRoomIdInputId}>
						Member Room ID
					</label>
					<div className="flex">
						<Input
							className="max-w-80"
							id={memberRoomIdInputId}
							name="roomId"
							readOnly
							value={memberRoomId}
						/>
						<CopyButton text={memberRoomId} />
					</div>
				</div>
				<div>
					<label className="text-sm" htmlFor={memberRoomUrlInputId}>
						Member Room URL
					</label>
					<div className="flex">
						<Input
							className="max-w-[605px]"
							id={memberRoomUrlInputId}
							name="roomId"
							readOnly
							value={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
						/>
						<CopyButton
							text={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
						/>
					</div>
				</div>
			</Section>
		</div>
	);
}

type NoteEditionFormProps = {
	ownerRoomId: string;
	note: string;
	onSubmit: (newNote: string) => void;
};
function NoteEditionForm({
	ownerRoomId,
	onSubmit,
	note,
}: NoteEditionFormProps) {
	const [state, formAction, isPending] = useActionState(editNoteAction, {
		error: {
			errors: { note: "" },
			inputs: { note },
			message: "",
		},
		success: false,
	});
	useEffect(() => {
		if (onSubmit && state.success && !isPending) {
			onSubmit(state.data.inputs.note);
		}
	}, [state, isPending, onSubmit]);
	return (
		<Form action={formAction} className="flex flex-col gap-1">
			<input name="ownerRoomId" type="hidden" value={ownerRoomId} />
			<Textarea
				className="h-48"
				defaultValue={
					state.success ? state.data.inputs.note : state.error.inputs.note
				}
				name="note"
			/>
			<div className="text-destructive text-sm">
				{!state.success && state.error.errors.note}
			</div>
			<div>
				<Button disabled={isPending}>Save</Button>
			</div>
		</Form>
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
