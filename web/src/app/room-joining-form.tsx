"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useActionState } from "react";
import { joinRoomAction } from "./_actions/join-room-action";

export function RoomJoiningForm() {
  const [state, formAction, isPending] = useActionState(joinRoomAction, {
    success: false,
    message: "",
  });

  return (
    <Form action={formAction}>
      <Input type="text" placeholder="Room ID" name="roomId" className="mb-1" />
      <Button disabled={isPending}>Join Room</Button>
      <div>{!state.success && state.message}</div>
    </Form>
  );
}
