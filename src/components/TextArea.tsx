import { type TextareaHTMLAttributes, forwardRef } from "react";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { cx } from "../theme/variants";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: FieldVariant;
  label?: string;
  /** Name of a variant defined in the theme config (variants[name].input.{root,label,field}). */
  themeVariant?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { variant = "default", label, themeVariant, rows = 4, className = "", style, ...props },
  ref,
) {
  const styles = useFieldStyles(themeVariant, variant);

  return (
    <Field label={label} htmlFor={props.id} themeVariant={themeVariant}>
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        className={cx(
          "mb-4 last:mb-0 block w-full resize-y",
          styles.fieldClass,
          FOCUS_RING,
          "sm:text-sm",
          className,
        )}
        style={{ ...styles.fieldStyle, ...style }}
      />
    </Field>
  );
});

export default TextArea;
