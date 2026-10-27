import { useEffect, type HTMLAttributes, type ReactNode } from "react";
import { Surface } from "./Surface";

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}

export function Modal({ title, onClose, className = "", style, children, ...props }: ModalProps) {
  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
        className={["w-full max-w-md p-4", className].join(" ")}
        style={style}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <h2 className="mb-2 text-lg font-bold">{title}</h2>}
        {children}
      </Surface>
    </div>
  );
}

export default Modal;
