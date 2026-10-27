import { type InputHTMLAttributes, forwardRef, useEffect } from "react";
import type { Validate } from "../utils/validation";
import { Input } from "./Input";
import { useDebounce } from "../hooks/useDebounce";
import React from "react";
import { useForm } from "./Form";
import Alert from "./Alert";

type Variant = "default" | "filled" | "underline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  label?: string;
  validator?: Validate;
  debounce?: number; // Debounce time in milliseconds
}

export const UnicornialInput = forwardRef<HTMLInputElement, InputProps>(function Minput(
  { variant = "default", debounce = 300, label, name, ...props },
  ref,
) {
  const { values, setValues, isSubmitting, setValidators } = useForm();

  useEffect(() => {
    if (name && props.validator) {
      setValidators((prev) => ({ ...(prev ?? {}), [name]: props.validator! }));
    }
  }, [name, props.validator, setValidators]);

  //validations --------------------------------------------------
  const [message, setMessage] = React.useState("");

  const debouncedChangeHandler = useDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
    validate(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  }, debounce || 300);

  const validate = (value: unknown) => {
    if (props.validator) {
      const result = props.validator.validate(value, (v) => setValues({ ...values, [name!]: v }));
      if (!result.valid) {
        setMessage(result.message);
      } else {
        setMessage("");
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    validate(event.target.value);
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (name) {
      setValues({ ...values, [name]: event.target.value });
    }
    debouncedChangeHandler(event);
  };

  return (
    <div>
      <Input
        variant={variant}
        label={label}
        ref={ref}
        value={name && ((values[name] as string) || "")}
        disabled={isSubmitting}
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {message && (
        <Alert variant="error" className="mt-2">
          {message}
        </Alert>
      )}
    </div>
  );
});
