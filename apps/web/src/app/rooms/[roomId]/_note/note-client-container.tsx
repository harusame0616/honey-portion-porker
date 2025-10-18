"use client";

import { useState } from "react";
import { EditNoteForm } from "./edit-note-form";
import { NoteEditablePresenter } from "./note-editable-presenter";

type NoteClientContainerProps = {
	roomId: string;
	note: string;
};

export function NoteClientContainer({
	roomId,
	note,
}: NoteClientContainerProps) {
	const [isNoteEditing, setIsNoteEditing] = useState(false);

	if (isNoteEditing) {
		return (
			<EditNoteForm
				note={note}
				onSubmit={() => {
					setIsNoteEditing(false);
				}}
				ownerRoomId={roomId}
			/>
		);
	}

	return (
		<NoteEditablePresenter
			note={note}
			onEditClick={() => setIsNoteEditing(true)}
		/>
	);
}
