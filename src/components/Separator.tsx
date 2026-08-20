import { type HTMLAttributes, forwardRef, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";

type Variant = "line" | "point";
type Orientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  orientation?: Orientation;
  color?: string;
  thickness?: number;
  spacing?: number;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      variant = "line",
      orientation = "horizontal",
      color,
      thickness = 1,
      spacing = 16,
      className = "",
      style,
      ...props
    },
    ref,
  ) {
    const theme = useTheme();

    const resolvedColor = useMemo(() => {
      if (color) return color;
      if (theme.enabled) return theme.darkMode ? "#2a2535" : "#e5e4e7";
      return "#e5e4e7";
    }, [color, theme]);

    const isHorizontal = orientation === "horizontal";

    if (variant === "point") {
      const paddingStyle = isHorizontal
        ? { paddingTop: spacing, paddingBottom: spacing }
        : { paddingLeft: spacing, paddingRight: spacing };

      return (
        <div
          ref={ref}
          className={[
            "flex items-center justify-center shrink-0",
            isHorizontal ? "w-full" : "h-full",
            className,
          ].join(" ")}
          style={{ ...paddingStyle, ...style }}
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
        className={[
          "shrink-0",
          isHorizontal ? "w-full" : "h-full",
          className,
        ].join(" ")}
        style={{ ...dimStyle, ...style }}
        {...props}
      />
    );
  },
);

export default Separator;
