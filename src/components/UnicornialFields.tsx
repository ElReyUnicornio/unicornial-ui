import type { ChangeEvent, ComponentType, FocusEvent } from "react";
import { useFormField } from "../hooks/useFormField";
import type { Validate } from "../utils/validation";
import { ColorPicker, type ColorPickerProps } from "./ColorPicker";
import { DatePicker, type DatePickerProps } from "./DatePicker";
import { FieldError } from "./Field";
import { FileInput, type FileInputProps } from "./FileInput";
import { ImageInput, type ImageInputProps } from "./ImageInput";
import { RadioGroup, type RadioGroupProps } from "./Radio";
import { Select, type SelectProps } from "./Select";
import { Slider, type SliderProps } from "./Slider";
import { Spinner, type SpinnerProps } from "./Spinner";
import { Switch, type SwitchProps } from "./Switch";
import { TextArea, type TextAreaProps } from "./TextArea";
import { UnicornialInput, type InputProps } from "./UnicornialInput";

/**
 * Form-connected versions of the field components, like UnicornialInput: they read and
 * write their value in the surrounding <Form> under `name`, register a `validator` and
 * show its error message. They must be used inside a <Form>.
 */
interface FormFieldProps {
  name: string;
  validator?: Validate;
}

/** Props every wrapped component has in common. */
interface BaseFieldProps<V> {
  onChange?: (value: V) => void;
  disabled?: boolean;
  themeVariant?: string;
}

/**
 * Connects `Component` to the form. `valueProp` is the prop that receives the form value
 * (`null` for components that keep their own state, like the file inputs) and `fallback`
 * the value used until the form has one.
 */
function bindToForm<P extends FormFieldProps & BaseFieldProps<V>, V>(
  Component: ComponentType<Omit<P, "validator"> & { value?: V; checked?: V }>,
  valueProp: "value" | "checked" | null,
  fallback: (props: P) => V,
) {
  return function BoundField(props: P) {
    const { name, validator, onChange, disabled, themeVariant, ...rest } = props;
    const field = useFormField<V>(name, validator, fallback(props));

    return (
      <div className={valueProp === "checked" ? "mb-4 last:mb-0" : undefined}>
        <Component
          {...(rest as unknown as Omit<P, "validator">)}
          {...(valueProp && { [valueProp]: field.value })}
          name={name}
          themeVariant={themeVariant}
          disabled={disabled || field.disabled}
          onChange={(value: V) => {
            field.onChange(value);
            onChange?.(value);
          }}
        />
        <FieldError message={field.message} themeVariant={themeVariant} />
      </div>
    );
  };
}

// Password ------------------------------------------------------------------------------------

export type UnicornialPasswordProps = Omit<InputProps, "type" | "name"> & FormFieldProps;

export function UnicornialPassword(props: UnicornialPasswordProps) {
  return <UnicornialInput {...props} type="password" />;
}

// TextArea ------------------------------------------------------------------------------------

export type UnicornialTextAreaProps = Omit<TextAreaProps, "name" | "value"> &
  FormFieldProps & {
    /** Delay (ms) before validating while typing. */
    debounce?: number;
  };

export function UnicornialTextArea({
  name,
  validator,
  debounce = 300,
  onChange,
  onBlur,
  disabled,
  themeVariant,
  ...props
}: UnicornialTextAreaProps) {
  const field = useFormField<string>(name, validator, "", debounce);

  return (
    <div>
      <TextArea
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          field.onChange(event.target.value);
          onChange?.(event);
        }}
        onBlur={(event: FocusEvent<HTMLTextAreaElement>) => {
          field.onBlur(event.target.value);
          onBlur?.(event);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// Value-based fields --------------------------------------------------------------------------

export type UnicornialSelectProps = Omit<SelectProps, "name" | "value"> & FormFieldProps;
export const UnicornialSelect = bindToForm<UnicornialSelectProps, string>(
  Select,
  "value",
  (p) => p.defaultValue ?? "",
);

export type UnicornialSwitchProps = Omit<SwitchProps, "name" | "checked"> & FormFieldProps;
export const UnicornialSwitch = bindToForm<UnicornialSwitchProps, boolean>(
  Switch,
  "checked",
  (p) => p.defaultChecked ?? false,
);

export type UnicornialSpinnerProps = Omit<SpinnerProps, "name" | "value"> & FormFieldProps;
export const UnicornialSpinner = bindToForm<UnicornialSpinnerProps, number>(
  Spinner,
  "value",
  (p) => p.defaultValue ?? (p.min === undefined || p.min === -Infinity ? 0 : p.min),
);

export type UnicornialSliderProps = Omit<SliderProps, "name" | "value"> & FormFieldProps;
export const UnicornialSlider = bindToForm<UnicornialSliderProps, number>(
  Slider,
  "value",
  (p) => p.defaultValue ?? p.min ?? 0,
);

export type UnicornialRadioGroupProps = Omit<RadioGroupProps, "name" | "value"> & FormFieldProps;
export const UnicornialRadioGroup = bindToForm<UnicornialRadioGroupProps, string>(
  RadioGroup,
  "value",
  (p) => p.defaultValue ?? "",
);

export type UnicornialColorPickerProps = Omit<ColorPickerProps, "name" | "value"> & FormFieldProps;
export const UnicornialColorPicker = bindToForm<UnicornialColorPickerProps, string>(
  ColorPicker,
  "value",
  (p) => p.defaultValue ?? "#aa3bff",
);

export type UnicornialDatePickerProps = Omit<DatePickerProps, "name" | "value"> & FormFieldProps;
export const UnicornialDatePicker = bindToForm<UnicornialDatePickerProps, string>(
  DatePicker,
  "value",
  (p) => p.defaultValue ?? "",
);

// File fields (the component keeps its own state) ---------------------------------------------

export type UnicornialFileInputProps = Omit<FileInputProps, "name"> & FormFieldProps;
/** The form value is the array of chosen `File`s. */
export const UnicornialFileInput = bindToForm<UnicornialFileInputProps, File[]>(
  FileInput,
  null,
  () => [],
);

export type UnicornialImageInputProps = Omit<ImageInputProps, "name"> & FormFieldProps;
/** The form value is the chosen image `File`, or `null`. */
export const UnicornialImageInput = bindToForm<UnicornialImageInputProps, File | null>(
  ImageInput,
  null,
  () => null,
);
