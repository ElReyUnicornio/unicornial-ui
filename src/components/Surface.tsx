import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { useTheme } from "../theme/ThemeProvider";

export const Surface = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Surface(
  { className = "", style, children, ...props },
  ref,
) {
  const theme = useTheme();

  const resolvedStyles = useMemo(
    () => ({
      borderColor: theme.darkMode ? theme.darkColors.border : theme.colors.border,
      backgroundColor: theme.darkMode ? theme.darkColors.background : theme.colors.background,
    }),
    [theme],
  );
  return (
    <div
      ref={ref}
      {...props}
      className={[className, "p-2 rounded-md shadow-md bg-white border"].join(" ")}
      style={{
        ...style,
        ...resolvedStyles,
      }}
    >
      {children}
    </div>
  );
});
