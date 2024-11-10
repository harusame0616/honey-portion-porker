"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Form from "next/form";
import { useActionState } from "react";
import { createNewRoomAction } from "./_actions/create-new-room-action";

export function NewRoomCreationForm() {
  const [state, formAction, isPending] = useActionState(
    createNewRoomAction,
    undefined
  );
  return (
    <Form action={formAction} className="w-full">
      <Button disabled={isPending} className="w-full font-bold">
        {isPending ? (
          <ReloadIcon
            className="animate-spin"
            role="img"
            aria-label="Creating new room"
          />
        ) : (
          "CREATE ROOM"
        )}
      </Button>
      <div>{state?.message}</div>
    </Form>
  );
}
