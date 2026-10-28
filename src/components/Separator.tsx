import { type HTMLAttributes, forwardRef, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

type Variant = "line" | "point";
type Orientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  orientation?: Orientation;
  color?: string;
  thickness?: number;
  spacing?: number;
  /** Name of a variant defined in the theme config (variants[name].separator.root). */
  themeVariant?: string;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      variant = "line",
      orientation = "horizontal",
      color,
      thickness = 1,
      spacing = 16,
      themeVariant,
      className = "",
      style,
      ...props
    },
    ref,
  ) {
    const theme = useTheme();
    const themed = useVariant("separator", themeVariant)("root");

    const resolvedColor = useMemo(() => {
      if (color) return color;
      return theme.currentColors.border;
    }, [color, theme]);

    const isHorizontal = orientation === "horizontal";

    if (variant === "point") {
      const paddingStyle = isHorizontal
        ? { paddingTop: spacing, paddingBottom: spacing }
        : { paddingLeft: spacing, paddingRight: spacing };

      return (
        <div
          ref={ref}
          className={cx(
            "flex items-center justify-center shrink-0",
            isHorizontal ? "w-full" : "h-full",
            themed.className,
            className,
          )}
          style={{ ...paddingStyle, ...themed.style, ...style }}
          {...props}
        >
          <span
            aria-hidden
            className="rounded-full shrink-0"
            style={{
              width: thickness * 4,
              height: thickness * 4,
              backgroundColor: resolvedColor,
            }}
          />
        </div>
      );
    }

    const dimStyle = isHorizontal
      ? {
          height: thickness,
          backgroundColor: resolvedColor,
          marginTop: spacing,
          marginBottom: spacing,
        }
      : {
          width: thickness,
          backgroundColor: resolvedColor,
          marginLeft: spacing,
          marginRight: spacing,
        };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx("shrink-0", isHorizontal ? "w-full" : "h-full", themed.className, className)}
        style={{ ...dimStyle, ...themed.style, ...style }}
        {...props}
      />
    );
  },
);

export default Separator;
