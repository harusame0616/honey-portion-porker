import { useOptimistic, useTransition } from "react";
import { updateAutoOpenAction } from "./update-auto-open-action";

type Params = {
  ownerRoomId: string;
  autoOpen: boolean;
  onSave: (newAutoReset: boolean) => Promise<void>;
};

export function useAutoOpenSaving({ onSave, autoOpen, ownerRoomId }: Params) {
  const [isPending, startTransition] = useTransition();

  const [optimisticAutoOpen, setOptimisticAutoOpen] = useOptimistic(autoOpen);

  function toggleAutoOpen() {
    startTransition(async () => {
      const newAutoOpen = !autoOpen;
      setOptimisticAutoOpen(!optimisticAutoOpen);
      const result = await updateAutoOpenAction(
        ownerRoomId,
        newAutoOpen
      );
      if (!result.success) {
        return;
      }
      onSave(newAutoOpen);
    });
  }

  return {
    isPending,
    optimisticAutoOpen,
    toggleAutoOpen,
  };
}
