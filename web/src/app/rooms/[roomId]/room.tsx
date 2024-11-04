"use client";

import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import Form from "next/form";
import {
  ComponentProps,
  PropsWithChildren,
  useActionState,
  useEffect,
  useState,
} from "react";
import { editNoteAction } from "./_actions/edit-note-action";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { CoffeeIcon, EditIcon } from "lucide-react";
import { Itim } from "next/font/google";
import { Input } from "@/components/ui/input";
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
  note,
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
  const [state, formAction, isPending] = useActionState(editNoteAction, {
    success: false,
    message: "",
  });

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
        const presenceTrackStatus = await channel.track({ card: undefined });
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
  }, [roomId]);

  const router = useRouter();

  useEffect(() => {
    if (state.success && !isPending) {
      channel.send({ type: "broadcast", event: "updateNote" }).then(() => {
        router.refresh();
        setIsNoteEditing(false);
      });
    }
  }, [state, isPending]);

  async function selectCard(number: number) {
    setSelectedCard(number);
    await channel.track({ card: number });
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
    await channel.track({ card: undefined });
    await channel.send({ type: "broadcast", event: "reset" });
  }
  const selectedUsers = users.filter(
    (user) => user.card !== -1 && user.card !== undefined
  );

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h2 className="font-bold">Your Choices</h2>
        <ul className="flex flex-wrap gap-4">
          {cardList.map((card) => (
            <li key={card}>
              <button type="button" onClick={() => selectCard(card)} key={card}>
                <Card isOpen selected={card === selectedCard}>
                  {card}
                </Card>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-bold">Member choices</h2>
        <div className="flex gap-4">
          {users.length ? (
            users.map((user) => (
              <Card isOpen={isOpen} selected={!!user.card} key={user.userId}>
                {user.card}
              </Card>
            ))
          ) : (
            <Card isOpen={false} selected={false}>
              0
            </Card>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-bold">Result</h2>
        <div className="text-sm">
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
        </div>
      </section>

      {ownerRoomId && (
        <section>
          <h2 className="font-bold">Owner Controls</h2>
          <div className="flex gap-4">
            {isOpen ? (
              <Button type="button" variant="outline" onClick={close}>
                CLOSE
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={open}>
                OPEN
              </Button>
            )}
            <Button type="button" variant="outline" onClick={reset}>
              RESET
            </Button>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-bold">
          Note
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setIsNoteEditing((prev) => !prev)}
          >
            <EditIcon />
          </Button>
        </h2>
        {ownerRoomId && isNoteEditing ? (
          <NoteEditionForm
            action={formAction}
            isPending={isPending}
            note={note}
            ownerRoomId={ownerRoomId}
          />
        ) : (
          <p className="whitespace-pre-wrap bg-muted p-4 rounded-md">
            {state.success ? state.data.note : note || "-"}
          </p>
        )}
      </section>
      <section className="">
        <h2 className="font-bold">Room information</h2>
        <div className="flex flex-col gap-2">
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
                value={`${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
                name="roomId"
                className="max-w-[605px]"
                readOnly
              />
              <CopyButton
                text={`${process.env.NEXT_PUBLIC_VERCEL_URL}/rooms/${memberRoomId}`}
              />
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}

type NoteEditionFormProps = {
  ownerRoomId: string;
  note: string;
  isPending: boolean;
} & ComponentProps<typeof Form>;
function NoteEditionForm({
  ownerRoomId,
  note,
  isPending,
  ...formProps
}: NoteEditionFormProps) {
  return (
    <Form {...formProps} className="flex flex-col gap-1">
      <input type="hidden" value={ownerRoomId} name="ownerRoomId" />
      <Textarea className="h-48" name="note" defaultValue={note} key={note} />
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
        "h-20 w-12 border-gray-500 border-2 rounded-md flex items-center justify-center text-4xl font-bold",
        cuteFont.className,
        selected ? "border-red-600" : ""
      )}
    >
      {isOpen ? (
        children === -1 ? (
          <CoffeeIcon className="size-10 text-2xl" />
        ) : (
          children
        )
      ) : (
        "-"
      )}
    </div>
  );
}
