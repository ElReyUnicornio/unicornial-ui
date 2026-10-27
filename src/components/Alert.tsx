import type React from "react";
import type { HTMLAttributes } from "react";

export type AlertVariant = "warning" | "info" | "error";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children?: React.ReactNode;
}

export const alertColors: Record<AlertVariant, { color: string; background: string; border: string }> = {
  warning: { color: "#92400e", background: "#fffbeb", border: "#f59e0b" },
  info: { color: "#1e40af", background: "#eff6ff", border: "#3b82f6" },
  error: { color: "#991b1b", background: "#fef2f2", border: "#ef4444" },
};

const iconPaths: Record<AlertVariant, React.ReactNode> = {
  warning: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
};

export function AlertIcon({ variant, size = 20 }: { variant: AlertVariant; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {iconPaths[variant]}
    </svg>
  );
}

export function Alert({
  variant = "info",
  className = "",
  style,
  children,
  ...props
}: AlertProps) {
  const colors = alertColors[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      {...props}
      className={["flex items-center gap-2 px-3 py-2 rounded-md border", className].join(" ")}
      style={{
        color: colors.color,
        backgroundColor: colors.background,
        borderColor: colors.border,
        ...style,
      }}
    >
      <AlertIcon variant={variant} />
      <span>{children}</span>
    </div>
  );
}

export default Alert;
