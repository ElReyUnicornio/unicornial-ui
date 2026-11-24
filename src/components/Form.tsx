import { createContext, useContext, useState } from "react";
import type Validate from "../utils/validation";

export interface ValidatorList {
  [key: string]: Validate;
}

interface FormContextType {
  initialValues: Record<string, unknown>;
  values: Record<string, unknown>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  isSubmitting: boolean;
  /** How many times the form was submitted; fields validate themselves when it changes. */
  submitCount: number;
  validators: ValidatorList | null;
  setValidators: React.Dispatch<React.SetStateAction<ValidatorList | null>>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  reset: () => void;
}

export interface FormProviderProps {
  initialValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>, hasErrors: boolean) => void;
  children: React.ReactNode;
}

const FormContext = createContext<FormContextType | null>(null);

export function Form({ initialValues, onSubmit, children }: FormProviderProps) {
  const [values, setValues] = useState(initialValues);
  const [validators, setValidators] = useState<ValidatorList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitCount((count) => count + 1);
    if (validators) {
      const hasErrors = Object.keys(validators).some((key) => {
        const validator = validators[key];
        const value = values[key];
        return !validator.validate(value).valid;
      });
      onSubmit(values, hasErrors);
    } else {
      onSubmit(values, false);
    }
  };

  return (
    <FormContext.Provider
      value={{
        initialValues,
        values,
        setValues,
        isSubmitting,
        submitCount,
        validators,
        setValidators,
        setIsSubmitting,
        handleSubmit,
        reset: () => {
          setValues(initialValues);
        },
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
