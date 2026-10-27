import type { HTMLAttributes, ReactNode } from "react";
import { AlertIcon, alertColors, type AlertVariant } from "./Alert";
import { CloseButton } from "./Modal";

export type ToastColor = AlertVariant;

interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  color?: ToastColor;
  message: ReactNode;
  onClose?: () => void;
}

export function Toast({
  color = "info",
  message,
  onClose,
  className = "",
  style,
  onClick,
  ...props
}: ToastProps) {
  const colors = alertColors[color];
  return (
    <div
      role={color === "error" ? "alert" : "status"}
      {...props}
      onClick={onClick}
      className={[
        "flex items-center gap-2 w-80 max-w-full px-3 py-2 rounded-md border shadow-md",
        onClick ? "cursor-pointer" : "",
        className,
      ].join(" ")}
      style={{
        color: colors.color,
        backgroundColor: colors.background,
        borderColor: colors.border,
        ...style,
      }}
    >
      <AlertIcon variant={color} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <CloseButton
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        />
      )}
    </div>
  );
}

export default Toast;
