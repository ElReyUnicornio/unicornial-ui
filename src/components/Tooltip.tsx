import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";
import { useFloatingPlacement, type Side } from "../utils/placement";

export type TooltipPosition = Side;

interface TooltipProps {
  anchorRef: RefObject<HTMLElement | null>;
  position?: TooltipPosition;
  arrow?: boolean;
  open?: boolean;
  /** Name of a variant defined in the theme config (variants[name].tooltip.{root,arrow}). */
  themeVariant?: string;
  className?: string;
  children?: ReactNode;
}

const ARROW_SIZE = 8;

// The arrow is a rotated square; only the two borders facing away from the tooltip are drawn.
const arrowBorders: Record<TooltipPosition, [string, string]> = {
  top: ["borderRight", "borderBottom"],
  bottom: ["borderLeft", "borderTop"],
  left: ["borderRight", "borderTop"],
  right: ["borderLeft", "borderBottom"],
};

export function Tooltip({
  anchorRef,
  position = "top",
  arrow = true,
  open = true,
  themeVariant,
  className = "",
  children,
}: TooltipProps) {
  const colors = useTheme().currentColors;
  const themed = useVariant("tooltip", themeVariant);
  const root = themed("root");
  const arrowVariant = themed("arrow");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const placement = useFloatingPlacement({
    anchorRef,
    floatingRef: tooltipRef,
    open,
    position,
    gap: arrow ? ARROW_SIZE + 4 : 6,
  });
  const id = useId();

  // Describe the anchor with the tooltip while it is open, so screen readers read it.
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!open || !anchor) return;
    anchor.setAttribute("aria-describedby", id);
    return () => anchor.removeAttribute("aria-describedby");
  }, [open, anchorRef, id]);

  if (!open || typeof document === "undefined") return null;

  const side = placement?.position ?? position;
  const [borderA, borderB] = arrowBorders[side];
  const offset = (placement?.arrowOffset ?? 0) - ARROW_SIZE / 2;
  const edge = -ARROW_SIZE / 2 - 1;
  const arrowStyle = {
    position: "absolute",
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    backgroundColor: colors.background,
    transform: "rotate(45deg)",
    // Longhands only (no shorthand mixing); the color follows the tooltip's own border.
    [`${borderA}Width`]: 1,
    [`${borderB}Width`]: 1,
    [`${borderA}Style`]: "solid",
    [`${borderB}Style`]: "solid",
    [`${borderA}Color`]: "inherit",
    [`${borderB}Color`]: "inherit",
    ...(side === "top" && { bottom: edge, left: offset }),
    ...(side === "bottom" && { top: edge, left: offset }),
    ...(side === "left" && { right: edge, top: offset }),
    ...(side === "right" && { left: edge, top: offset }),
    ...arrowVariant.style,
  } as const;

  return createPortal(
    <div
      ref={tooltipRef}
      id={id}
      role="tooltip"
      className={cx("fixed px-2 py-1 text-sm rounded-md border shadow-float", root.className, className)}
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
        ...root.style,
      }}
    >
      {children}
      {arrow && <span aria-hidden="true" className={arrowVariant.className} style={arrowStyle} />}
    </div>,
    document.getElementById("unicornial-portal") ?? document.body,
  );
}

export default Tooltip;
