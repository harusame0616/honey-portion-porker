import { createClient } from "@/lib/supabase/server";
import * as v from "valibot";
import { Room } from "./room";
import Link from "next/link";
import { Itim } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import icon from "@/app/_resources/icon.svg";

const titleFont = Itim({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: "normal",
});

async function getRoom(roomId: string) {
  const client = await createClient();
  const roomSelect = await client
    .from("room")
    .select("*")
    .or(`ownerRoomId.eq.${roomId},memberRoomId.eq.${roomId}`)
    .single();

  if (roomSelect.error || !roomSelect.data.roomId) {
    console.log(roomSelect);
    return {
      success: false as const,
      message: "not found",
      data: null,
    };
  }

  return {
    success: true as const,
    message: "",
    data: {
      roomId: roomSelect.data.roomId,
      ownerRoomId: roomSelect.data.ownerRoomId,
      memberRoomId: roomSelect.data.memberRoomId,
      note: roomSelect.data.note,
    },
  };
}

const paramsSchema = v.object({
  roomId: v.pipe(v.string(), v.uuid()),
});

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const paramsParseResult = v.safeParse(paramsSchema, await params);

  if (!paramsParseResult.success) {
    return <div>invalid request</div>;
  }

  const roomGettingResult = await getRoom(paramsParseResult.output.roomId);

  if (!roomGettingResult.success) {
    return <div>not found</div>;
  }

  return (
    <div>
      <header className="bg-primary p-4 shadow-md">
        <Link href="/" className="flex items-end gap-1">
          <Image src={icon} alt="" width={45} height={45} />
          <h1 className={cn("font-bold text-3xl", titleFont.className)}>
            Honey Portion Poker
          </h1>
        </Link>
      </header>
      <div className="p-8">
        <main>
          <Room
            roomId={roomGettingResult.data.roomId}
            ownerRoomId={
              paramsParseResult.output.roomId ===
              roomGettingResult.data.ownerRoomId
                ? roomGettingResult.data.ownerRoomId
                : undefined
            }
            memberRoomId={roomGettingResult.data.memberRoomId}
            note={roomGettingResult.data.note}
          />
        </main>
      </div>
    </div>
  );
}
