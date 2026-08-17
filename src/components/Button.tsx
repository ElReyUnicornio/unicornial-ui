import { type ButtonHTMLAttributes, forwardRef } from "react";

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref,
) {
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
        className,
      ].join(" ")}
      {...props}
    />
  );
});
