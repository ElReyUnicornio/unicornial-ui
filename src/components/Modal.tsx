import { useEffect, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { Surface } from "./Surface";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  onClose?: () => void;
  /** Name of a variant defined in the theme config (variants[name].modal.{backdrop,container,header,title,body}). */
  themeVariant?: string;
  children?: ReactNode;
}

export function CloseButton({ onClick }: { onClick?: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="shrink-0 p-1 rounded-md cursor-pointer opacity-60 hover:opacity-100 hover:bg-black/10"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

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

export function Modal({
  title,
  onClose,
  themeVariant,
  className = "",
  style,
  children,
  ...props
}: ModalProps) {
  const { text } = useTheme();
  const themed = useVariant("modal", themeVariant);
  const backdrop = themed("backdrop");
  const container = themed("container");
  const header = themed("header");
  const titleStyle = themed("title");
  const body = themed("body");
  useEscape(onClose);

  return (
    <div
      className={cx("fixed inset-0 flex items-center justify-center p-4", backdrop.className)}
      style={{ backgroundColor: "#00000066", ...backdrop.style }}
      onClick={onClose}
    >
      <Surface
        role="dialog"
        aria-modal="true"
        themeVariant={themeVariant}
        {...props}
        className={cx("w-full max-w-md p-0", container.className, className)}
        style={{ ...container.style, ...style }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={cx("flex items-center justify-between gap-2 px-4 py-2 border-b border-inherit", header.className)}
          style={header.style}
        >
          <h2 className={cx(text.subtitle, titleStyle.className)} style={titleStyle.style}>
            {title}
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className={cx("p-4", text.paragraph, body.className)} style={body.style}>
          {children}
        </div>
      </Surface>
    </div>
  );
}

export default Modal;
