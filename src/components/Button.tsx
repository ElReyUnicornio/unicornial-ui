import { type ButtonHTMLAttributes, forwardRef, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";
import { hexToRgba } from "../utils/color";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Name of a variant defined in the theme config (variants[name].button.{root,primary,secondary,outline,ghost}); root applies to all, the variant part only to that variant. */
  themeVariant?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-linear-to-bl from-(--theme-primary-from) to-(--theme-primary-to) hover:bg-linear-to-tr text-white focus-visible:ring-focus/40",
  secondary: "bg-code-bg text-text-h hover:bg-code-bg/80 focus-visible:ring-focus/40",
  outline:
    "border border-border bg-transparent text-text-h hover:bg-hover hover:border-accent-border focus-visible:ring-focus/40",
  ghost: "bg-transparent text-text-h hover:bg-hover focus-visible:ring-focus/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", themeVariant, className = "", style, ...props },
  ref,
) {
  const theme = useTheme();
  const getThemed = useVariant("button", themeVariant);
  const themedRoot = getThemed("root");
  const themedVariant = getThemed(variant);

  const themeStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const { primary, secondary, text, border } = theme.currentColors;
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
          color: "#08060d", // secondary is a light color in both modes
        };
      case "outline":
        return {
          borderColor: border,
          backgroundColor: "transparent",
          color: text,
          ["--hover-bg" as any]: primaryBg,
          ["--hover-border" as any]: primaryBorder,
          ["--tw-ring-color" as any]: primaryRing,
        };
      case "ghost":
      default:
        return {
          backgroundColor: "transparent",
          color: text,
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
      className={cx(
        "inline-flex items-center justify-center font-medium rounded-md hover:cursor-pointer",
        "transition-all duration-200 ease-in-out",
        "disabled:opacity-50 disabled:pointer-events-none",
        "select-none",
        variantClasses[variant],
        sizeClasses[size],
        themeHoverClass,
        themedRoot.className,
        themedVariant.className,
        className,
      )}
      style={{ ...themeStyle, ...themedRoot.style, ...themedVariant.style, ...style }}
      {...props}
    />
  );
});
