import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type TagProps = ComponentPropsWithoutRef<"span">;

export function Tag({ className, ...props }: TagProps) {
  return <span className={cn("ds-tag", className)} {...props} />;
}
