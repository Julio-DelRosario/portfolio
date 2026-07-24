import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  as?: Extract<ElementType, "h1" | "h2" | "h3" | "h4">;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
};

export function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  description,
  align = "start",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn("ds-section-heading", `ds-section-heading--${align}`, className)}
      {...props}
    >
      {eyebrow ? <p className="ds-section-heading__eyebrow">{eyebrow}</p> : null}
      <Heading className="ds-section-heading__title">{title}</Heading>
      {description ? (
        <p className="ds-section-heading__description">{description}</p>
      ) : null}
    </div>
  );
}
