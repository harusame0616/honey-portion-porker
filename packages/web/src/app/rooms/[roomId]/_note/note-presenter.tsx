import { Section } from "@/components/section";

type NotePresenterProps = {
	note: string;
};

export function NotePresenter({ note }: NotePresenterProps) {
	return (
		<Section title="Note">
			<p className="whitespace-pre-wrap break-all">{note || "-"}</p>
		</Section>
	);
}
