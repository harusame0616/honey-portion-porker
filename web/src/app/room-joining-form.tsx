"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useActionState } from "react";
import { joinRoomAction } from "./_actions/join-room-action";
import { ReloadIcon } from "@radix-ui/react-icons";

export function RoomJoiningForm() {
  const [state, formAction, isPending] = useActionState(joinRoomAction, {
    success: false,
    message: "",
  });

  return (
    <Form action={formAction} className="w-full">
      <Input
        type="text"
        placeholder="Room ID"
        name="roomId"
        className="mb-1"
        required
      />
      <Button className="w-full font-bold" disabled={isPending}>
        {isPending ? <ReloadIcon className="animate-spin" /> : "JOIN ROOM"}
      </Button>
      <div>{!state.success && state.message}</div>
    </Form>
  );
}
