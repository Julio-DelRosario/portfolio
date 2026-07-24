import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type PillProps = ComponentPropsWithoutRef<"span"> & {
  active?: boolean;
};

export function Pill({ className, active = false, ...props }: PillProps) {
  return (
    <span
      data-active={active || undefined}
      className={cn("ds-pill", className)}
      {...props}
    />
  );
}
