import type { ComponentPropsWithoutRef } from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

type HexagonState = "default" | "inactive" | "hover" | "glow";

type HexagonProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "children" | "height" | "width"
> & {
  /** The rendered width and height of the hexagon. */
  size?: number | string;
  /** A visual treatment for use in composed layouts such as a future HexGrid. */
  state?: HexagonState;
  /** An accessible name. Omit for decorative hexagons. */
  title?: string;
};

/**
 * A scalable, presentational hexagon primitive. Its visual state is controlled
 * by props so parent components can decide when a hexagon is highlighted.
 */
function Hexagon({
  className,
  size = 48,
  state = "default",
  title,
  ...props
}: HexagonProps) {
  const titleId = useId();

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
      className={cn("hexagon", `hexagon--${state}`, className)}
      height={size}
      role={title ? "img" : undefined}
      viewBox="0 0 100 100"
      width={size}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <polygon
        className="hexagon__shape"
        points="50,0 93.301,25 93.301,75 50,100 6.699,75 6.699,25"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export { Hexagon };
export type { HexagonProps, HexagonState };
