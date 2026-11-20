import type { HTMLAttributes, ReactNode } from "react";
import { AlertIcon, alertColors, alertCssVars, type AlertVariant } from "./Alert";
import { cx, useVariant } from "../theme/variants";
import { CloseButton } from "./Overlay";

export type ToastColor = AlertVariant;

interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  color?: ToastColor;
  message: ReactNode;
  onClose?: () => void;
  /** Name of a variant defined in the theme config (variants[name].toast.root). */
  themeVariant?: string;
}

export function Toast({
  color = "info",
  message,
  onClose,
  themeVariant,
  className = "",
  style,
  onClick,
  ...props
}: ToastProps) {
  const colors = alertColors[color];
  const themed = useVariant("toast", themeVariant)("root");
  return (
    <div
      role={color === "error" ? "alert" : "status"}
      {...props}
      onClick={onClick}
      className={cx(
        "flex items-center gap-2 w-80 max-w-full px-3 py-2 rounded-md border shadow-float",
        onClick && "cursor-pointer",
        themed.className,
        className,
      )}
      style={{
        color: colors.color,
        background: colors.background,
        borderColor: colors.border,
        ...alertCssVars(color),
        ...themed.style,
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
