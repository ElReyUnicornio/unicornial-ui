import { type InputHTMLAttributes, forwardRef } from "react";
import type { Validate } from "../utils/validation";
import { Input } from "./Input";
import { Password } from "./Password";
import { FieldError } from "./Field";
import { useFormField } from "../hooks/useFormField";

type Variant = "default" | "filled" | "underline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  label?: string;
  themeVariant?: string;
  validator?: Validate;
  /** Delay in milliseconds before validating while typing. */
  debounce?: number;
}

export const UnicornialInput = forwardRef<HTMLInputElement, InputProps>(function UnicornialInput(
  { debounce = 300, name, validator, themeVariant, onChange, onBlur, disabled, type, ...props },
  ref,
) {
  const field = useFormField<string>(name, validator, "", debounce);
  const Component = type === "password" ? Password : Input;

  return (
    <div>
      <Component
        {...props}
        {...field.errorProps}
        ref={ref}
        name={name}
        themeVariant={themeVariant}
        // Without a name the input is not part of the form and stays uncontrolled.
        value={name ? field.value : undefined}
        disabled={disabled || field.disabled}
        onChange={(event) => {
          field.onChange(event.target.value);
          onChange?.(event);
        }}
        onBlur={(event) => {
          field.onBlur(event.target.value);
          onBlur?.(event);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} id={field.errorId} />
    </div>
  );
});
