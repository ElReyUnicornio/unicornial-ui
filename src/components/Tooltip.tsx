import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/ThemeProvider";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  anchorRef: RefObject<HTMLElement | null>;
  position?: TooltipPosition;
  arrow?: boolean;
  open?: boolean;
  className?: string;
  children?: ReactNode;
}

interface Placement {
  position: TooltipPosition;
  top: number;
  left: number;
  arrowOffset: number;
}

const SCREEN_MARGIN = 8;
const ARROW_SIZE = 8;
const ARROW_PADDING = 10;

const opposite: Record<TooltipPosition, TooltipPosition> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

// The arrow is a rotated square; only the two borders facing away from the tooltip are drawn.
const arrowBorders: Record<TooltipPosition, [string, string]> = {
  top: ["borderRight", "borderBottom"],
  bottom: ["borderLeft", "borderTop"],
  left: ["borderRight", "borderTop"],
  right: ["borderLeft", "borderBottom"],
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, Math.max(min, max)));

function computePlacement(
  anchor: DOMRect,
  tooltip: DOMRect,
  preferred: TooltipPosition,
  gap: number,
): Placement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space: Record<TooltipPosition, number> = {
    top: anchor.top,
    bottom: vh - anchor.bottom,
    left: anchor.left,
    right: vw - anchor.right,
  };
  const needed: Record<TooltipPosition, number> = {
    top: tooltip.height + gap + SCREEN_MARGIN,
    bottom: tooltip.height + gap + SCREEN_MARGIN,
    left: tooltip.width + gap + SCREEN_MARGIN,
    right: tooltip.width + gap + SCREEN_MARGIN,
  };
  const fits = (side: TooltipPosition) => space[side] >= needed[side];

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
    const left = clamp(center - tooltip.width / 2, SCREEN_MARGIN, vw - tooltip.width - SCREEN_MARGIN);
    return {
      position,
      left,
      top: position === "top" ? anchor.top - tooltip.height - gap : anchor.bottom + gap,
      arrowOffset: clamp(center - left, ARROW_PADDING, tooltip.width - ARROW_PADDING),
    };
  }

  const center = anchor.top + anchor.height / 2;
  const top = clamp(center - tooltip.height / 2, SCREEN_MARGIN, vh - tooltip.height - SCREEN_MARGIN);
  return {
    position,
    top,
    left: position === "left" ? anchor.left - tooltip.width - gap : anchor.right + gap,
    arrowOffset: clamp(center - top, ARROW_PADDING, tooltip.height - ARROW_PADDING),
  };
}

export function Tooltip({
  anchorRef,
  position = "top",
  arrow = true,
  open = true,
  className = "",
  children,
}: TooltipProps) {
  const theme = useTheme();
  const colors = theme.darkMode ? theme.darkColors : theme.colors;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;
    if (!anchor || !tooltip) return;
    const next = computePlacement(
      anchor.getBoundingClientRect(),
      tooltip.getBoundingClientRect(),
      position,
      arrow ? ARROW_SIZE + 4 : 6,
    );
    setPlacement((prev) =>
      prev &&
      prev.position === next.position &&
      prev.top === next.top &&
      prev.left === next.left &&
      prev.arrowOffset === next.arrowOffset
        ? prev
        : next,
    );
  }, [anchorRef, position, arrow]);

  useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update, children]);

  if (!open || typeof document === "undefined") return null;

  const side = placement?.position ?? position;
  const [borderA, borderB] = arrowBorders[side];
  const arrowStyle = {
    position: "absolute",
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    backgroundColor: colors.background,
    transform: "rotate(45deg)",
    [borderA]: `1px solid ${colors.border}`,
    [borderB]: `1px solid ${colors.border}`,
    ...(side === "top" && { bottom: -ARROW_SIZE / 2 - 1, left: (placement?.arrowOffset ?? 0) - ARROW_SIZE / 2 }),
    ...(side === "bottom" && { top: -ARROW_SIZE / 2 - 1, left: (placement?.arrowOffset ?? 0) - ARROW_SIZE / 2 }),
    ...(side === "left" && { right: -ARROW_SIZE / 2 - 1, top: (placement?.arrowOffset ?? 0) - ARROW_SIZE / 2 }),
    ...(side === "right" && { left: -ARROW_SIZE / 2 - 1, top: (placement?.arrowOffset ?? 0) - ARROW_SIZE / 2 }),
  } as const;

  return createPortal(
    <div
      ref={tooltipRef}
      role="tooltip"
      className={["fixed px-2 py-1 text-sm rounded-md border shadow-md", className].join(" ")}
      style={{
        top: placement?.top ?? 0,
        left: placement?.left ?? 0,
        width: "max-content",
        maxWidth: "16rem",
        // Hidden until measured so it never flashes in the wrong place.
        visibility: placement ? "visible" : "hidden",
        pointerEvents: "none",
        color: colors.text,
        backgroundColor: colors.background,
        borderColor: colors.border,
      }}
    >
      {children}
      {arrow && <span aria-hidden="true" style={arrowStyle} />}
    </div>,
    document.getElementById("unicornial-portal") ?? document.body,
  );
}

export default Tooltip;
