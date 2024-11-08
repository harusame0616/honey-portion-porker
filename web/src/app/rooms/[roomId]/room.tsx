"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import { CoffeeIcon, EditIcon } from "lucide-react";
import { Itim } from "next/font/google";
import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useActionState,
  useEffect,
  useState,
} from "react";
import cardIcon from "../../_resources/icon.svg";
import { editNoteAction } from "./_actions/edit-note-action";
import { CopyButton } from "./copy-button";

const cardList = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, -1];

const client = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
let channel: ReturnType<(typeof client)["channel"]>;

const cuteFont = Itim({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: "normal",
});
export function Room({
  roomId,
  note: initialNote,
  ownerRoomId,
  memberRoomId,
}: {
  roomId: string;
  note: string;
  ownerRoomId?: string;
  memberRoomId: string;
}) {
  const [isNoteEditing, setIsNoteEditing] = useState(false);
  const [users, setUsers] = useState<{ card: number; userId: string }[]>([]);
  const [selectedCard, setSelectedCard] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(initialNote);

  const router = useRouter();

  useEffect(() => {
    channel = client.channel(roomId);

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState<{
          card: number;
        }>();
        setUsers(
          Object.entries(newState).map(([userId, [{ card }]]) => ({
            userId,
            card,
          }))
        );
      })
      .on("broadcast", { event: "open" }, () => {
        setIsOpen(true);
      })
      .on("broadcast", { event: "close" }, () => {
        setIsOpen(false);
      })
      .on("broadcast", { event: "reset" }, async () => {
        await channel.track({ card: undefined });
        setSelectedCard(undefined);
        setIsOpen(false);
      })
      .on("broadcast", { event: "updateNote" }, async () => {
        router.refresh();
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }

        await channel.track({
          card: undefined,
        });
      });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, router]);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  async function selectCard(number: number | undefined) {
    setSelectedCard(number);
    await channel.track({ card: number });
  }
  async function unselectCard() {
    selectCard(undefined);
  }

  async function open() {
    setIsOpen(true);
    await channel.send({ type: "broadcast", event: "open" });
  }

  async function close() {
    setIsOpen(false);
    await channel.send({ type: "broadcast", event: "close" });
  }

  async function reset() {
    setIsOpen(false);
    setSelectedCard(undefined);
    await channel.track({ card: undefined });
    await channel.send({ type: "broadcast", event: "reset" });
  }
  const selectedUsers = users.filter(
    (user) => user.card !== -1 && user.card !== undefined
  );

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
            onSubmit={async (newNote) => {
              await channel.send({ type: "broadcast", event: "updateNote" });
              setNote(newNote);
              setIsNoteEditing(false);
              router.refresh();
            }}
          />
        ) : (
          <p className="whitespace-pre-wrap">{note || "-"}</p>
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

      <Section title="Member's cards" className="flex gap-4">
        {users.length ? (
          users.map((user) => (
            <Card isOpen={isOpen} selected={!!user.card} key={user.userId}>
              {user.card}
            </Card>
          ))
        ) : (
          <Card isOpen={false} selected={false} />
        )}
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

      <Section title="Room information" className="flex flex-col gap-2">
        <label>
          ID
          <div className="flex">
            <Input
              value={memberRoomId}
              name="roomId"
              readOnly
              className="max-w-80"
            />
            <CopyButton text={memberRoomId} />
          </div>
        </label>
        <label>
          Member URL
          <div className="flex">
            <Input
              value={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
              name="roomId"
              className="max-w-[605px]"
              readOnly
            />
            <CopyButton
              text={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
            />
          </div>
        </label>
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

type CardProps = PropsWithChildren<{
  isOpen: boolean;
  selected: boolean;
}>;
function Card({ children, isOpen, selected }: CardProps) {
  return (
    <div
      className={cn(
        "h-20 w-12 border-gray-500 border-2 rounded-md flex items-center justify-center text-4xl font-bold bg-white",
        cuteFont.className,
        selected ? "bg-primary" : ""
      )}
    >
      {isOpen ? (
        children === -1 ? (
          <CoffeeIcon className="size-10 text-2xl" />
        ) : (
          children
        )
      ) : (
        <Image alt="" src={cardIcon} width={30} />
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
