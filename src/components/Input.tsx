import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { cx } from "../theme/variants";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: FieldVariant;
  label?: string;
  /** Name of a variant defined in the theme config (variants[name].input.{root,label,field}). */
  themeVariant?: string;
  /** Content shown inside the input, on its right side (e.g. an icon button). */
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "default", label, themeVariant, endAdornment, className = "", style, ...props },
  ref,
) {
  const styles = useFieldStyles(themeVariant, variant);

  return (
    <Field label={label} htmlFor={props.id} themeVariant={themeVariant}>
      <div className="relative mb-4 last:mb-0">
        <input
          ref={ref}
          {...props}
          className={cx(
            "block w-full",
            styles.fieldClass,
            FOCUS_RING,
            "sm:text-sm",
            !!endAdornment && "pr-10",
            className,
          )}
          style={{ ...styles.fieldStyle, ...style }}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>
        )}
      </div>
    </Field>
  );
});
