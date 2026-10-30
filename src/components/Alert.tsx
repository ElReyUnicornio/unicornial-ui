import type React from "react";
import type { HTMLAttributes } from "react";
import { cx, useVariant } from "../theme/variants";

export type AlertVariant = "warning" | "info" | "error" | "success";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  /** Name of a variant defined in the theme config (variants[name].alert.root). */
  themeVariant?: string;
  children?: React.ReactNode;
}

/** CSS variables exposing a severity's colors, so theme variants can build on them. */
export function alertCssVars(variant: AlertVariant) {
  const colors = alertColors[variant];
  return {
    "--alert-color": colors.color,
    "--alert-bg": colors.background,
    "--alert-border": colors.border,
  } as React.CSSProperties;
}

// Derived from one hue per severity and mixed with the theme colors, so it reads in light and dark.
const severityHue: Record<AlertVariant, string> = {
  warning: "#f59e0b",
  info: "#3b82f6",
  error: "#ef4444",
  success: "#22c55e",
};

const severityColors = (hue: string) => ({
  color: `color-mix(in srgb, ${hue} 65%, var(--theme-text))`,
  background: `color-mix(in srgb, ${hue} 10%, var(--theme-background))`,
  border: `color-mix(in srgb, ${hue} 35%, var(--theme-background))`,
});

export const alertColors: Record<
  AlertVariant,
  { color: string; background: string; border: string }
> = {
  warning: severityColors(severityHue.warning),
  info: severityColors(severityHue.info),
  error: severityColors(severityHue.error),
  success: severityColors(severityHue.success),
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
  success: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
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
  themeVariant,
  className = "",
  style,
  children,
  ...props
}: AlertProps) {
  const colors = alertColors[variant];
  const themed = useVariant("alert", themeVariant)("root");
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      {...props}
      className={cx(
        "flex items-center gap-2 px-3 py-2 rounded-md border",
        themed.className,
        className,
      )}
      style={{
        color: colors.color,
        backgroundColor: colors.background,
        borderColor: colors.border,
        ...alertCssVars(variant),
        ...themed.style,
        ...style,
      }}
    >
      <AlertIcon variant={variant} />
      <span>{children}</span>
    </div>
  );
}

export default Alert;
