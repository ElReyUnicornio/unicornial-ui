import { type HTMLAttributes, forwardRef } from "react";

type Variant =
  | "dots-grid"
  | "isometric-dot-paper"
  | "paper"
  | "diamond-grid"
  | "paper-45"
  | "lines"
  | "falling-stars";

export interface BackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  color?: string;
  size?: number;
}

const variantStyles: Record<
  Variant,
  (color: string, size: number) => React.CSSProperties
> = {
  "dots-grid": (c, s) => ({
    backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  "isometric-dot-paper": (c, s) => ({
    backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s * 1.732}px`,
    backgroundPosition: `0 0, ${s / 2}px ${(s * 1.732) / 2}px`,
  }),
  paper: (c, s) => ({
    backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  "diamond-grid": (c, s) => ({
    backgroundImage: `linear-gradient(45deg, ${c} 1px, transparent 1px), linear-gradient(-45deg, ${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  "paper-45": (c, s) => ({
    backgroundImage: `linear-gradient(45deg, ${c} 1px, transparent 1px), linear-gradient(-45deg, ${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  lines: (c, s) => ({
    backgroundImage: `linear-gradient(${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  "falling-stars": (c, s) => ({
    backgroundImage: `
      radial-gradient(${c} 1px, transparent 1px),
      radial-gradient(${c} 1px, transparent 1px),
      radial-gradient(${c} 1.5px, transparent 1.5px),
      radial-gradient(${c} 1px, transparent 1px)
    `,
    backgroundSize: `${s * 5}px ${s * 5}px, ${s * 3}px ${s * 3}px, ${s * 7}px ${s * 7}px, ${s * 4}px ${s * 4}px`,
    backgroundPosition: `0 0, ${s}px ${s * 2}px, ${s * 3}px ${s}px, ${s * 2}px ${s * 4}px`,
    animation: "falling-stars 20s linear infinite",
  }),
};

export const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  function Background(
    {
      variant = "dots-grid",
      color = "rgba(170, 59, 255, 0.25)",
      size = 24,
      className = "",
      children,
      ...props
    },
    ref,
  ) {
    const styles = variantStyles[variant](color, size);

    return (
      <div
        ref={ref}
        className={["w-full h-full relative overflow-hidden", className].join(
          " ",
        )}
        {...props}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={styles}
        />
        {children}
      </div>
    );
  },
);

export default Background;
