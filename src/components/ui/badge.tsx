import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "neutral" | "accent" | "success";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span className={cn("ds-badge", `ds-badge--${tone}`, className)} {...props} />
  );
}
