"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
import { editNoteAction } from "./_actions/edit-note-action";
import { AutoOpenCheckbox } from "./auto-open-checkbox";
import { AutoResetCheckbox } from "./auto-reset-checkbox";
import { Card } from "./card";
import { CopyButton } from "./copy-button";
import { usePlanningPoker } from "./use-planning-poker";

const cardList = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, -1];

export function Room({
	roomId,
	note,
	ownerRoomId,
	memberRoomId,
	initialAutoReset,
	autoOpen,
}: {
	roomId: string;
	note: string;
	ownerRoomId?: string;
	memberRoomId: string;
	initialAutoReset: boolean;
	autoOpen: boolean;
}) {
	const {
		users,
		selectedUsers,
		selectedCard,
		selectCard,
		isOpen,
		unselectCard,
		open,
		close,
		refresh,
		reset,
		enableAutoReset,
		disableAutoReset,
		autoReset,
	} = usePlanningPoker({ roomId, ownerRoomId, initialAutoReset, autoOpen });
	const [isNoteEditing, setIsNoteEditing] = useState(false);

	const memberRoomIdInputId = useId();
	const memberRoomUrlInputId = useId();

	return (
		<div className="flex flex-col gap-4">
			<Section
				title="Note"
				bar={
					ownerRoomId && (
						<div className="-mb-[6px]">
							<Button
								variant="ghost"
								size="icon"
								type="button"
								onClick={() => setIsNoteEditing((prev) => !prev)}
							>
								<EditIcon />
							</Button>
						</div>
					)
				}
			>
				{ownerRoomId && isNoteEditing ? (
					<NoteEditionForm
						note={note}
						ownerRoomId={ownerRoomId}
						onSubmit={async () => {
							await refresh();
							setIsNoteEditing(false);
						}}
					/>
				) : (
					<p className="whitespace-pre-wrap break-all">{note || "-"}</p>
				)}
			</Section>

			<Section title="Your choices">
				<ul className="flex flex-wrap gap-4">
					{cardList.map((card) => (
						<li key={card}>
							<button
								type="button"
								onClick={() =>
									selectedCard === card ? unselectCard() : selectCard(card)
								}
								key={card}
							>
								<Card isOpen selected={card === selectedCard}>
									{card}
								</Card>
							</button>
						</li>
					))}
				</ul>
			</Section>

			<Section title="Member's cards">
				<ul className="flex gap-4 flex-wrap">
					{users.length ? (
						users.map((user) => (
							<li key={user.userId}>
								<Card isOpen={isOpen} selected={!!user.card} key={user.userId}>
									{user.card}
								</Card>
							</li>
						))
					) : (
						<Card isOpen={false} selected={false} />
					)}
				</ul>
			</Section>

			{ownerRoomId && (
				<Section title="Owner operations" className="flex gap-4">
					{isOpen ? (
						<Button type="button" onClick={close} className="font-bold">
							CLOSE
						</Button>
					) : (
						<Button type="button" onClick={open} className="font-bold">
							OPEN
						</Button>
					)}
					<Button
						type="button"
						variant="outline"
						onClick={reset}
						className="font-bold"
					>
						RESET
					</Button>
				</Section>
			)}

			<Section title="Result" className="text-sm">
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
				<Section title="Configures" className="flex flex-col gap-2">
					<AutoResetCheckbox
						ownerRoomId={ownerRoomId}
						checked={autoReset}
						onCheckedChange={() => {
							if (autoReset) {
								enableAutoReset();
							} else {
								disableAutoReset();
							}
						}}
					/>
					<AutoOpenCheckbox
						ownerRoomId={ownerRoomId}
						checked={autoOpen}
						onCheckedChange={async () => {
							await refresh();
						}}
					/>
				</Section>
			)}

			<Section title="Room information" className="flex flex-col gap-2">
				<div>
					<label className="text-sm" htmlFor={memberRoomIdInputId}>
						Member Room ID
					</label>
					<div className="flex">
						<Input
							value={memberRoomId}
							name="roomId"
							readOnly
							className="max-w-80"
							id={memberRoomIdInputId}
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
							value={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
							name="roomId"
							className="max-w-[605px]"
							readOnly
							id={memberRoomUrlInputId}
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
		success: false,
		message: "",
		errors: { note: "" },
		inputs: { note },
	});
	useEffect(() => {
		if (onSubmit && state.success && !isPending) {
			onSubmit(state.inputs.note);
		}
	}, [state, isPending, onSubmit]);
	return (
		<Form action={formAction} className="flex flex-col gap-1">
			<input type="hidden" value={ownerRoomId} name="ownerRoomId" />
			<Textarea className="h-48" name="note" defaultValue={state.inputs.note} />
			<div className="text-destructive text-sm">
				{!state.success && state.errors.note}
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
