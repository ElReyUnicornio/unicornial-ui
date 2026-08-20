import { type ButtonHTMLAttributes, forwardRef, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent/50",
  secondary:
    "bg-code-bg text-text-h hover:bg-code-bg/80 focus-visible:ring-code-bg/50",
  outline:
    "border border-border bg-transparent text-text-h hover:bg-accent-bg hover:border-accent-border focus-visible:ring-accent/50",
  ghost:
    "bg-transparent text-text-h hover:bg-accent-bg focus-visible:ring-accent/50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3 text-lg gap-2.5",
};

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", style, ...props },
  ref,
) {
  const theme = useTheme();

  const themeStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const primary = theme.colors.primary;
    const secondary = theme.colors.secondary;
    const primaryBg = hexToRgba(primary, 0.1);
    const primaryBorder = hexToRgba(primary, 0.5);
    const primaryRing = hexToRgba(primary, 0.5);

    switch (variant) {
      case "primary":
        return {
          backgroundColor: primary,
          color: "#fff",
          ["--tw-ring-color" as any]: primaryRing,
        };
      case "secondary":
        return {
          backgroundColor: secondary,
          color: "#08060d",
        };
      case "outline":
        return {
          borderColor: "#e5e4e7",
          backgroundColor: "transparent",
          color: "#08060d",
          ["--hover-bg" as any]: primaryBg,
          ["--hover-border" as any]: primaryBorder,
          ["--tw-ring-color" as any]: primaryRing,
        };
      case "ghost":
      default:
        return {
          backgroundColor: "transparent",
          color: "#08060d",
          ["--hover-bg" as any]: primaryBg,
          ["--tw-ring-color" as any]: primaryRing,
        };
    }
  }, [theme, variant]);

  const themeHoverClass =
    theme.enabled && variant === "primary"
      ? "hover:brightness-110"
      : theme.enabled && variant === "outline"
        ? "hover:bg-[var(--hover-bg)] hover:border-[var(--hover-border)]"
        : theme.enabled
          ? "hover:bg-[var(--hover-bg)]"
          : "";

  return (
    <button
      ref={ref}
      className={[
        "inline-flex items-center justify-center font-medium rounded-lg",
        "transition-all duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "select-none",
        variantClasses[variant],
        sizeClasses[size],
        themeHoverClass,
        className,
      ].join(" ")}
      style={{ ...themeStyle, ...style }}
      {...props}
    />
  );
});
