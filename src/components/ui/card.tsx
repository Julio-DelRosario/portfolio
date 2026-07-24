import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  padding?: "none" | "sm" | "md" | "lg";
};

export function Card({ className, padding = "md", ...props }: CardProps) {
  return (
    <article
      className={cn("ds-card", `ds-card--padding-${padding}`, className)}
      {...props}
    />
  );
}
