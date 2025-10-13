"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { EditIcon } from "lucide-react";
import {
	type DetailedHTMLProps,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactNode,
	useId,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { editNoteAction } from "./_actions/edit-note-action";
import { NOTE_MAX_LENGTH } from "./_actions/edit-note-action.constants";
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

const noteFormSchema = v.object({
	note: v.pipe(
		v.string(),
		v.maxLength(
			NOTE_MAX_LENGTH,
			`${NOTE_MAX_LENGTH}文字以内で入力してください`,
		),
	),
});

type NoteFormSchema = v.InferOutput<typeof noteFormSchema>;

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
	const form = useForm<NoteFormSchema>({
		defaultValues: {
			note,
		},
		resolver: valibotResolver(noteFormSchema),
	});

	const submit = async ({ note }: NoteFormSchema) => {
		const result = await editNoteAction({
			note,
			ownerRoomId,
		});

		if (result.success) {
			onSubmit(note);
		} else {
			form.setError("note", {
				message: result.error,
				type: "manual",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-1"
				onSubmit={form.handleSubmit(submit)}
			>
				<FormField
					control={form.control}
					name="note"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea className="h-48" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<Button disabled={form.formState.isSubmitting}>Save</Button>
				</div>
			</form>
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
