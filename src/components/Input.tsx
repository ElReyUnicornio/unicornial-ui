import {
  type InputHTMLAttributes,
  forwardRef,
  useMemo,
  type ReactNode,
} from "react";
import { useTheme } from "../theme/ThemeProvider";

type Variant = "default" | "filled" | "underline";
type Size = "sm" | "md" | "lg";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  Isize?: Size;
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-5 text-lg",
};

const sizePaddingWithIcon: Record<Size, string> = {
  sm: "pl-9 pr-3",
  md: "pl-11 pr-4",
  lg: "pl-13 pr-5",
};

const sizePaddingWithRightIcon: Record<Size, string> = {
  sm: "pl-3 pr-9",
  md: "pl-4 pr-11",
  lg: "pl-5 pr-13",
};

const sizePaddingWithBothIcons: Record<Size, string> = {
  sm: "pl-9 pr-9",
  md: "pl-11 pr-11",
  lg: "pl-13 pr-13",
};

const iconSizeClasses: Record<Size, string> = {
  sm: "w-4 h-4 left-2.5",
  md: "w-5 h-5 left-3",
  lg: "w-6 h-6 left-4",
};

const rightIconSizeClasses: Record<Size, string> = {
  sm: "w-4 h-4 right-2.5",
  md: "w-5 h-5 right-3",
  lg: "w-6 h-6 right-4",
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

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = "default",
    Isize = "md",
    error = false,
    leftIcon,
    rightIcon,
    className = "",
    wrapperClassName = "",
    style,
    disabled,
    ...props
  },
  ref,
) {
  const theme = useTheme();

  const baseWrapperClasses = "relative w-full flex items-center";

  const variantWrapperStyles = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const primary = theme.colors.primary;
    const border = theme.darkMode ? "#2a2535" : "#e5e4e7";
    const filledBg = theme.darkMode ? "#14111f" : "#f5f5f7";
    const errorBorder = "#ef4444";

    const base: React.CSSProperties = {
      borderRadius: variant === "underline" ? 0 : 8,
    };

    switch (variant) {
      case "filled":
        return {
          ...base,
          backgroundColor: filledBg,
          borderBottom: `2px solid ${error ? errorBorder : "transparent"}`,
          ["--focus-border" as any]: error ? errorBorder : primary,
          ["--ring-color" as any]: hexToRgba(error ? errorBorder : primary, 0.5),
        };
      case "underline":
        return {
          ...base,
          backgroundColor: "transparent",
          borderBottom: `1.5px solid ${error ? errorBorder : border}`,
          ["--focus-border" as any]: error ? errorBorder : primary,
          ["--ring-color" as any]: hexToRgba(error ? errorBorder : primary, 0.5),
        };
      case "default":
      default:
        return {
          ...base,
          backgroundColor: theme.darkMode ? "#0b0912" : "#ffffff",
          border: `1px solid ${error ? errorBorder : border}`,
          ["--focus-border" as any]: error ? errorBorder : primary,
          ["--ring-color" as any]: hexToRgba(error ? errorBorder : primary, 0.5),
        };
    }
  }, [theme, variant, error]);

  const variantWrapperClass = useMemo(() => {
    if (theme.enabled) {
      if (variant === "underline") {
        return "focus-within:border-b-[2px] focus-within:border-b-[var(--focus-border)]";
      }
      return "focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-0 focus-within:border-[var(--focus-border)]";
    }

    if (variant === "underline") {
      return error
        ? "border-b-2 border-b-red-500 focus-within:border-b-accent"
        : "border-b border-border focus-within:border-b-2 focus-within:border-b-accent";
    }

    const ringClass =
      "focus-within:ring-2 focus-within:ring-accent/50 focus-within:ring-offset-0";

    switch (variant) {
      case "filled":
        return error
          ? `bg-code-bg border-b-2 border-b-red-500 ${ringClass} focus-within:border-b-accent`
          : `bg-code-bg border-b-2 border-b-transparent ${ringClass} focus-within:border-b-accent`;
      case "default":
      default:
        return error
          ? `bg-bg border border-red-500 rounded-lg ${ringClass} focus-within:border-accent`
          : `bg-bg border border-border rounded-lg ${ringClass} focus-within:border-accent`;
    }
  }, [theme, variant, error]);

  const inputSizeClass =
    leftIcon && rightIcon
      ? sizePaddingWithBothIcons[Isize]
      : leftIcon
        ? sizePaddingWithIcon[Isize]
        : rightIcon
          ? sizePaddingWithRightIcon[Isize]
          : sizeClasses[Isize];

  const inputVariantClass =
    variant === "underline" ? "bg-transparent rounded-none" : "rounded-lg";

  const themeInputStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const textColor = theme.darkMode ? "#e8e4f0" : "#08060d";
    const placeholderColor = hexToRgba(
      theme.darkMode ? "#908a9e" : "#706a7c",
      1,
    );
    return {
      color: textColor,
      ["--placeholder-color" as any]: placeholderColor,
      backgroundColor: "transparent",
    };
  }, [theme]);

  const themeInputPlaceholderClass = theme.enabled
    ? "placeholder:text-[color:var(--placeholder-color)]"
    : "placeholder:text-text-muted";

  return (
    <div
      className={[
        baseWrapperClasses,
        variantWrapperClass,
        disabled ? "opacity-50 cursor-not-allowed" : "",
        wrapperClassName,
      ].join(" ")}
      style={variantWrapperStyles}
    >
      {leftIcon && (
        <span
          aria-hidden
          className={[
            "absolute text-text-muted pointer-events-none shrink-0",
            iconSizeClasses[Isize],
          ].join(" ")}
        >
          {leftIcon}
        </span>
      )}

      <input
        ref={ref}
        disabled={disabled}
        className={[
          "w-full h-full outline-none bg-transparent font-normal",
          "transition-all duration-200 ease-in-out",
          "disabled:cursor-not-allowed",
          inputSizeClass,
          inputVariantClass,
          themeInputPlaceholderClass,
          className,
        ].join(" ")}
        style={{ ...themeInputStyle, ...style }}
        {...props}
      />

      {rightIcon && (
        <span
          aria-hidden
          className={[
            "absolute text-text-muted pointer-events-none shrink-0",
            rightIconSizeClasses[Isize],
          ].join(" ")}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
});
