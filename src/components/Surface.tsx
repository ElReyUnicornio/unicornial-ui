import { forwardRef, type HTMLAttributes } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  themeVariant?: string;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  { className = "", style, themeVariant, children, ...props },
  ref,
) {
  const { currentColors } = useTheme();
  const variant = useVariant("surface", themeVariant)("root");

  return (
    <div
      ref={ref}
      {...props}
      className={cx("p-2 rounded-md shadow-md bg-white border", variant.className, className)}
      style={{
        borderColor: currentColors.border,
        backgroundColor: currentColors.background,
        color: currentColors.text,
        ...variant.style,
        ...style,
      }}
    >
      {children}
    </div>
  );
});
