import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type DividerProps = ComponentPropsWithoutRef<"hr"> & {
  orientation?: "horizontal" | "vertical";
};

export function Divider({
  className,
  orientation = "horizontal",
  ...props
}: DividerProps) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn("ds-divider", `ds-divider--${orientation}`, className)}
      {...props}
    />
  );
}
