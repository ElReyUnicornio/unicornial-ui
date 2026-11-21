import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";
import Alert from "./Alert";

export type FieldVariant = "default" | "filled" | "underline";

const variantClasses: Record<FieldVariant, string> = {
  default: "border rounded-md px-3 py-2",
  filled: "border rounded-md px-3 py-2",
  underline: "border-b px-3 py-2",
};

export const FOCUS_RING =
  "focus:outline-none focus:ring-2 focus:ring-focus/40 focus:border-focus";

/**
 * Styles shared by every form field: the `input` variant parts (root, label, field)
 * plus the theme colors. Field-like components (Select, TextArea, ...) reuse them so
 * a theme variant restyles all of them at once.
 */
export function useFieldStyles(themeVariant?: string, variant: FieldVariant = "default") {
  const { currentColors } = useTheme();
  const themed = useVariant("input", themeVariant);
  const root = themed("root");
  const label = themed("label");
  const field = themed("field");

  const fieldStyle: CSSProperties = {
    color: currentColors.text,
    borderColor: currentColors.border,
    backgroundColor: variant === "filled" ? currentColors.header.background : "transparent",
    ...field.style,
  };

  return {
    rootClass: cx("w-full", root.className),
    rootStyle: root.style,
    labelClass: cx("block text-sm font-medium mb-1.5", label.className),
    labelStyle: { color: currentColors.text, ...label.style } as CSSProperties,
    fieldClass: cx(variantClasses[variant], field.className),
    fieldStyle,
  };
}

interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  themeVariant?: string;
  className?: string;
  children?: ReactNode;
}

/** Wrapper with the themed label used by all form fields. */
export function Field({ label, htmlFor, themeVariant, className = "", children }: FieldProps) {
  const styles = useFieldStyles(themeVariant);
  return (
    <div className={cx(styles.rootClass, className)} style={styles.rootStyle}>
      {label && (
        <label htmlFor={htmlFor} className={styles.labelClass} style={styles.labelStyle}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

/** Label with a secondary value aligned to the right (e.g. "Volume ... 40%"). */
export function LabelWithValue({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <span className="flex justify-between">
      <span>{label}</span>
      <span className="font-normal opacity-70">{children}</span>
    </span>
  );
}

/** Validation message shown under a form-connected field; renders nothing when empty. */
export function FieldError({
  message,
  themeVariant,
  id,
}: {
  message: string;
  themeVariant?: string;
  id?: string;
}) {
  if (!message) return null;
  return (
    <Alert id={id} variant="error" themeVariant={themeVariant} className="mt-2">
      {message}
    </Alert>
  );
}
