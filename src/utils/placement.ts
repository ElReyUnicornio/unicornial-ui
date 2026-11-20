import { useCallback, useLayoutEffect, useState, type RefObject } from "react";
import { clamp } from "./number";

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export interface Placement {
  position: Side;
  top: number;
  left: number;
  /** Distance from the floating element's start edge to the anchor's center (for arrows). */
  arrowOffset: number;
  anchorWidth: number;
}

const SCREEN_MARGIN = 8;
const ARROW_PADDING = 10;

const opposite: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** Position along the cross axis for the requested alignment. */
function alignStart(anchorStart: number, anchorSize: number, size: number, align: Align) {
  if (align === "start") return anchorStart;
  if (align === "end") return anchorStart + anchorSize - size;
  return anchorStart + anchorSize / 2 - size / 2;
}

export function computePlacement(
  anchor: DOMRect,
  floating: DOMRect,
  preferred: Side,
  gap: number,
  align: Align = "center",
): Placement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space: Record<Side, number> = {
    top: anchor.top,
    bottom: vh - anchor.bottom,
    left: anchor.left,
    right: vw - anchor.right,
  };
  const needed = (side: Side) =>
    (side === "top" || side === "bottom" ? floating.height : floating.width) +
    gap +
    SCREEN_MARGIN;
  const fits = (side: Side) => space[side] >= needed(side);

  // Prefer the requested side, then the opposite one, then whichever has more room.
  const flipped = opposite[preferred];
  const position = fits(preferred)
    ? preferred
    : fits(flipped)
      ? flipped
      : space[preferred] >= space[flipped]
        ? preferred
        : flipped;

  if (position === "top" || position === "bottom") {
    const center = anchor.left + anchor.width / 2;
    const left = clamp(
      alignStart(anchor.left, anchor.width, floating.width, align),
      SCREEN_MARGIN,
      vw - floating.width - SCREEN_MARGIN,
    );
    return {
      position,
      left,
      top: position === "top" ? anchor.top - floating.height - gap : anchor.bottom + gap,
      arrowOffset: clamp(center - left, ARROW_PADDING, floating.width - ARROW_PADDING),
      anchorWidth: anchor.width,
    };
  }

  const center = anchor.top + anchor.height / 2;
  const top = clamp(
    alignStart(anchor.top, anchor.height, floating.height, align),
    SCREEN_MARGIN,
    vh - floating.height - SCREEN_MARGIN,
  );
  return {
    position,
    top,
    left: position === "left" ? anchor.left - floating.width - gap : anchor.right + gap,
    arrowOffset: clamp(center - top, ARROW_PADDING, floating.height - ARROW_PADDING),
    anchorWidth: anchor.width,
  };
}

interface FloatingOptions {
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  open: boolean;
  position: Side;
  gap: number;
  align?: Align;
  /** Changing this value re-measures (e.g. the floating content). */
  content?: unknown;
}

/** Measures the anchor and floating elements and keeps the placement up to date. */
export function useFloatingPlacement({
  anchorRef,
  floatingRef,
  open,
  position,
  gap,
  align = "center",
  content,
}: FloatingOptions) {
  const [placement, setPlacement] = useState<Placement | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const next = computePlacement(
      anchor.getBoundingClientRect(),
      floating.getBoundingClientRect(),
      position,
      gap,
      align,
    );
    setPlacement((prev) =>
      prev &&
      prev.position === next.position &&
      prev.top === next.top &&
      prev.left === next.left &&
      prev.arrowOffset === next.arrowOffset &&
      prev.anchorWidth === next.anchorWidth
        ? prev
        : next,
    );
  }, [anchorRef, floatingRef, position, gap, align]);

  useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update, content]);

  return open ? placement : null;
}
