import { valibotResolver } from "@hookform/resolvers/valibot";
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
import { Textarea } from "@/components/ui/textarea";
import { editNoteAction } from "./_actions/edit-note-action";
import { NOTE_MAX_LENGTH } from "./_actions/edit-note-action.constants";
import { Section } from "./section";

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

type EditNoteFormProps = {
	ownerRoomId: string;
	note: string;
	onSubmit: () => void;
};

export function EditNoteForm({
	ownerRoomId,
	onSubmit,
	note,
}: EditNoteFormProps) {
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
			onSubmit();
		} else {
			form.setError("note", {
				message: result.error,
				type: "manual",
			});
		}
	};

	return (
		<Section title="Note">
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
		</Section>
	);
}
