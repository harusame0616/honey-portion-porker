import { Suspense } from "react";
import { NoteServerContainer } from "./_note/note-server-container";
import { NoteSkeleton } from "./_note/note-skeleton";

type RSCRoomProps = {
	roomId: string;
};

export function RSCRoom({ roomId }: RSCRoomProps) {
	return (
		<Suspense fallback={<NoteSkeleton />}>
			<NoteServerContainer roomId={roomId} />
		</Suspense>
	);
}
