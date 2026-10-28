import { type HTMLAttributes, forwardRef, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { hexToRgba, rgbaToString } from "../utils/utils";

// types ----------------------------------------------------------------------------------------------
type Variant =
  | "dots-grid"
  | "dots-isometric"
  | "grid"
  | "diamond"
  | "grid-45"
  | "lines";

  type Mask = "fade-in" | "fade-out" | "none";

export interface BackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  mask?: Mask;
  color?: string;
  size?: number;
}

// styles ----------------------------------------------------------------------------------------------
const variantStyles: Record<
  Variant,
  (color: string, size: number) => React.CSSProperties
> = {
  "dots-grid": (c, s) => ({
    backgroundImage: `radial-gradient(${c} 1.5px, transparent 1.5px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  "dots-isometric": (c, s) => ({
  backgroundImage: `
    radial-gradient(circle, ${c} 1px, transparent 1px),
    radial-gradient(circle, ${c} 1px, transparent 1px)
  `,
  backgroundSize: `${s}px ${s * 0.866}px`,
  backgroundPosition: `
    0 0,
    ${s / 2}px ${s * 0.433}px
  `,
  }),
  grid: (c, s) => ({
    backgroundImage: `linear-gradient(${c} 2px, transparent 2px), linear-gradient(90deg, ${c} 2px, transparent 2px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
  "diamond": (c, s) => {
  const diamondSize = 2.2;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${s}"
         height="${s * 0.866}"
         viewBox="0 0 ${s} ${s * 0.866}">
      <polygon
        points="
          ${s / 2},0
          ${s / 2 + diamondSize},${diamondSize}
          ${s / 2},${diamondSize * 2}
          ${s / 2 - diamondSize},${diamondSize}
        "
        fill="${c}"
      />
    </svg>
  `;

  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: `${s}px ${s * 0.866}px`,
  };
},
  "grid-45": (c, s) => ({
    backgroundImage: `
    linear-gradient(
      45deg,
      transparent 49%,
      ${c} 49%,
      ${c} 51%,
      transparent 51%
    ),
    linear-gradient(
      -45deg,
      transparent 49%,
      ${c} 49%,
      ${c} 51%,
      transparent 51%
    )
  `,
  backgroundSize: `${s}px ${s}px`,
  }),
  lines: (c, s) => ({
    backgroundImage: `linear-gradient(${c} 1px, transparent 1px)`,
    backgroundSize: `${s}px ${s}px`,
  }),
};

const maskStyles: Record<Mask, () => React.CSSProperties> = {
  "fade-in": () => ({
    maskImage: `
      radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0) 75%
      )
    `,
    WebkitMaskImage: `
      radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0) 75%
      )
    `,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  }),

  "fade-out": () => ({
    maskImage: `
      radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.6) 100%
      )
    `,
    WebkitMaskImage: `
      radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.6) 100%
      )
    `,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  }),
  none: () => ({
  }),
};

// component ----------------------------------------------------------------------------------------------
export const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  function Background(
    {
      variant = "dots-grid",
      mask = "none",
      color,
      size = 24,
      className = "",
      style,
      children,
      ...props
    },
    ref,
  ) {
    const theme = useTheme();

    const resolvedColor = useMemo(() => {
      if (color) return color;
      return rgbaToString(hexToRgba(theme.currentColors.primary, 0.25));
    }, [color, theme]);

    const bgStyles = useMemo<React.CSSProperties>(
      () => ({...variantStyles[variant](resolvedColor, size), ...maskStyles[mask]()}),
      [variant, mask, resolvedColor, size],
    );

    return (
      <div
        ref={ref}
        className={["w-full h-full relative overflow-x-hidden overflow-y-auto flex flex-col", className].join(
          " ",
        )}
        style={style}
        {...props}
      >
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={bgStyles}
        />
        {children}
      </div>
    );
  },
);

export default Background;
