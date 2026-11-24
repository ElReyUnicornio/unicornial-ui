import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx, useVariant } from "../theme/variants";

export type WireframeShape = "text" | "box" | "pill";
export type WireframeTone = "outline" | "fill";

export interface WireframeProps extends HTMLAttributes<HTMLDivElement> {
  /** Name of a variant defined in the theme config (variants[name].wireframe.root). */
  themeVariant?: string;
}

export interface WireframeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** `text` is a thin bar, `box` an input or card, `pill` a rounded chip or button. */
  shape?: WireframeShape;
  /** `outline` draws a dashed border, `fill` a soft solid block. Text bars default to `fill`. */
  tone?: WireframeTone;
  /** A number is in pixels. */
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  /** Name of a variant defined in the theme config (variants[name].wireframe.block). */
  themeVariant?: string;
}

// Mixed with the text color, so they get lighter in dark mode and stay visible in both.
const TINT = "color-mix(in srgb, var(--theme-primary) 65%, var(--theme-text))";
const LINE = `color-mix(in srgb, ${TINT} 60%, transparent)`;
const FILL = `color-mix(in srgb, ${TINT} 22%, transparent)`;

const shapes: Record<WireframeShape, { height: number; borderRadius: number }> = {
  text: { height: 10, borderRadius: 4 },
  box: { height: 40, borderRadius: 12 },
  pill: { height: 36, borderRadius: 9999 },
};

/** A placeholder sketch of a UI. It is hidden from screen readers unless `aria-hidden={false}`. */
const WireframeRoot = forwardRef<HTMLDivElement, WireframeProps>(function Wireframe(
  { className = "", style, themeVariant, children, ...props },
  ref,
) {
  const themed = useVariant("wireframe", themeVariant)("root");

  return (
    <div
      ref={ref}
      aria-hidden
      {...props}
      className={cx("flex flex-col gap-3 p-5", themed.className, className)}
      style={{ border: `1.5px dashed ${LINE}`, borderRadius: 16, ...themed.style, ...style }}
    >
      {children}
    </div>
  );
});

function WireframeRow({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("flex items-center gap-2", className)} />;
}

function WireframeBlock({
  shape = "box",
  tone = shape === "text" ? "fill" : "outline",
  width = "100%",
  height,
  className = "",
  style,
  themeVariant,
  ...props
}: WireframeBlockProps) {
  const themed = useVariant("wireframe", themeVariant)("block");

  return (
    <div
      {...props}
      className={cx("shrink-0 max-w-full", themed.className, className)}
      style={{
        width,
        height: height ?? shapes[shape].height,
        borderRadius: shapes[shape].borderRadius,
        ...(tone === "fill" ? { backgroundColor: FILL } : { border: `1.5px dashed ${LINE}` }),
        ...themed.style,
        ...style,
      }}
    />
  );
}

export const Wireframe = Object.assign(WireframeRoot, {
  Row: WireframeRow,
  Block: WireframeBlock,
});

export default Wireframe;
