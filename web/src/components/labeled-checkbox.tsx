import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { ComponentPropsWithoutRef, PropsWithChildren } from "react";

export function LabeledCheckbox({
  children,
  ...props
}: PropsWithChildren<ComponentPropsWithoutRef<typeof Checkbox>>) {
  return (
    <Label className="flex gap-1 items-center">
      <Checkbox {...props} />
      <div className="flex items-center">{children}</div>
    </Label>
  );
}
