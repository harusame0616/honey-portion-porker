import { EditIcon } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";

type NoteEditablePresenterProps = {
	note: string;
	onEditClick: () => void;
};

export function NoteEditablePresenter({
	note,
	onEditClick,
}: NoteEditablePresenterProps) {
	return (
		<Section
			bar={
				<div className="-mb-[6px]">
					<Button
						onClick={onEditClick}
						size="icon"
						type="button"
						variant="ghost"
					>
						<EditIcon />
					</Button>
				</div>
			}
			title="Note"
		>
			<p className="whitespace-pre-wrap break-all">{note || "-"}</p>
		</Section>
	);
}
