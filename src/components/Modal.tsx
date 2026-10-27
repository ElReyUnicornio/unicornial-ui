import { useEffect, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { Surface } from "./Surface";

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}

export function CloseButton({ onClick }: { onClick?: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="shrink-0 p-1 rounded-md cursor-pointer text-gray-500 hover:bg-black/10"
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

export function Modal({ title, onClose, className = "", style, children, ...props }: ModalProps) {
  useEscape(onClose);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00000066" }}
      onClick={onClose}
    >
      <Surface
        role="dialog"
        aria-modal="true"
        {...props}
        className={["w-full max-w-md p-0", className].join(" ")}
        style={style}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-inherit">
          <h2 className="text-lg font-bold">{title}</h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="p-4">{children}</div>
      </Surface>
    </div>
  );
}

export default Modal;
