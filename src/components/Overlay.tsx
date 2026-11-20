import { useEffect, type MouseEvent, type ReactNode } from "react";
import { CloseIcon } from "./icons";
import { cx } from "../theme/variants";
import type { StyleDef } from "../theme/types";

export function CloseButton({ onClick }: { onClick?: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="shrink-0 p-1 rounded-md cursor-pointer opacity-60 hover:opacity-100 hover:bg-hover"
    >
      <CloseIcon />
    </button>
  );
}

/** Calls `onEscape` when Escape is pressed while mounted. */
export function useEscape(onEscape?: () => void) {
  useEffect(() => {
    if (!onEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
}

interface BackdropProps {
  /** Called on click outside the content and on Escape. */
  onDismiss?: () => void;
  /** Layout classes of the backdrop (alignment of the content). */
  className?: string;
  /** Classes and style coming from the theme variant's `backdrop` part. */
  themed: StyleDef;
  children: ReactNode;
}

/** Full-screen dimmed layer shared by Modal, Drawer and AlertDialog. */
export function Backdrop({ onDismiss, className, themed, children }: BackdropProps) {
  useEscape(onDismiss);
  return (
    <div
      className={cx("fixed inset-0", className, themed.className)}
      style={{ backgroundColor: "#00000066", ...themed.style }}
      onClick={onDismiss}
    >
      {children}
    </div>
  );
}

/** Stops clicks inside the content from reaching the backdrop's dismiss handler. */
export const stopPropagation = (event: MouseEvent) => event.stopPropagation();

/** Title + close button row shared by Modal and Drawer. */
export function OverlayHeader({
  title,
  onClose,
  className,
  themedHeader,
  themedTitle,
  titleClass,
}: {
  title: ReactNode;
  onClose?: () => void;
  className?: string;
  themedHeader: StyleDef;
  themedTitle: StyleDef;
  titleClass: string;
}) {
  return (
    <div
      className={cx(
        "flex items-center justify-between gap-2 px-4 py-2 border-b border-inherit",
        className,
        themedHeader.className,
      )}
      style={themedHeader.style}
    >
      <h2 className={cx(titleClass, themedTitle.className)} style={themedTitle.style}>
        {title}
      </h2>
      <CloseButton onClick={onClose} />
    </div>
  );
}
