import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";
import { useFloatingPlacement, type Align, type Side } from "../utils/placement";

export interface DropdownProps {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  /** Called on Escape or when clicking outside of the dropdown and its anchor. */
  onClose?: () => void;
  position?: Side;
  align?: Align;
  /** Makes the dropdown at least as wide as its anchor. */
  matchWidth?: boolean;
  /** Name of a variant defined in the theme config (variants[name].dropdown.root). */
  themeVariant?: string;
  className?: string;
  style?: CSSProperties;
  role?: string;
  id?: string;
  children?: ReactNode;
}

/** A floating panel anchored to an element, like Tooltip but with arbitrary content. */
export function Dropdown({
  anchorRef,
  open,
  onClose,
  position = "bottom",
  align = "start",
  matchWidth = false,
  themeVariant,
  className = "",
  style,
  role,
  id,
  children,
}: DropdownProps) {
  const colors = useTheme().currentColors;
  const root = useVariant("dropdown", themeVariant)("root");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const placement = useFloatingPlacement({
    anchorRef,
    floatingRef: dropdownRef,
    open,
    position,
    gap: 4,
    align,
    content: children,
  });

  useEffect(() => {
    if (!open || !onClose) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dropdownRef}
      id={id}
      role={role}
      className={cx("fixed rounded-md border shadow-md", root.className, className)}
      style={{
        top: placement?.top ?? 0,
        left: placement?.left ?? 0,
        minWidth: matchWidth ? placement?.anchorWidth : undefined,
        width: "max-content",
        maxWidth: "calc(100vw - 16px)",
        // Hidden until measured so it never flashes in the wrong place.
        visibility: placement ? "visible" : "hidden",
        // The portal layer ignores pointer events; the dropdown must receive them.
        pointerEvents: "auto",
        color: colors.text,
        backgroundColor: colors.background,
        borderColor: colors.border,
        ...root.style,
        ...style,
      }}
    >
      {children}
    </div>,
    document.getElementById("unicornial-portal") ?? document.body,
  );
}

export default Dropdown;
