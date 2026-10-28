import { useEffect, useState } from "react";
import { useForm } from "../components/Form";
import type { Validate } from "../utils/validation";
import { useDebounce } from "./useDebounce";

/**
 * Connects a field to the surrounding <Form>: its value lives in the form values under
 * `name`, its validator is registered for submit, and the error message is kept here.
 * `debounce` (ms) delays validation while changing, useful for text; 0 validates at once.
 */
export function useFormField<T>(
  name: string | undefined,
  validator: Validate | undefined,
  fallback: T,
  debounce = 0,
) {
  const { values, setValues, isSubmitting, setValidators } = useForm();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (name && validator) {
      setValidators((prev) => ({ ...(prev ?? {}), [name]: validator }));
    }
  }, [name, validator, setValidators]);

  // Make the field's initial value part of the form values so it is submitted even if untouched.
  useEffect(() => {
    if (name) setValues((prev) => (prev[name] === undefined ? { ...prev, [name]: fallback } : prev));
    // Only needed when the field mounts or its name changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, setValues]);

  const value = name && values[name] !== undefined ? (values[name] as T) : fallback;

  const validate = (next: T) => {
    if (!name || !validator) return;
    const result = validator.validate(next, (transformed) => {
      setValues((prev) => ({ ...prev, [name]: transformed }));
      return transformed;
    });
    setMessage(result.valid ? "" : result.message);
  };
  const validateDebounced = useDebounce(validate, debounce || 1);

  return {
    value,
    disabled: isSubmitting,
    message,
    /** Stores the new value in the form and validates it. */
    onChange: (next: T) => {
      if (name) setValues((prev) => ({ ...prev, [name]: next }));
      if (debounce > 0) validateDebounced(next);
      else validate(next);
    },
    /** Validates the current value immediately. */
    onBlur: (current: T = value) => validate(current),
  };
}
