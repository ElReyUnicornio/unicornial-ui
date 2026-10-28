import type { ChangeEvent, FocusEvent } from "react";
import { useFormField } from "../hooks/useFormField";
import type { Validate } from "../utils/validation";
import Alert from "./Alert";
import { ColorPicker, type ColorPickerProps } from "./ColorPicker";
import { DatePicker, type DatePickerProps } from "./DatePicker";
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

function FieldError({ message, themeVariant }: { message: string; themeVariant?: string }) {
  if (!message) return null;
  return (
    <Alert variant="error" themeVariant={themeVariant} className="mt-2">
      {message}
    </Alert>
  );
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

// Select --------------------------------------------------------------------------------------

export type UnicornialSelectProps = Omit<SelectProps, "name" | "value"> & FormFieldProps;

export function UnicornialSelect({
  name,
  validator,
  defaultValue,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialSelectProps) {
  const field = useFormField<string>(name, validator, defaultValue ?? "");

  return (
    <div>
      <Select
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(value) => {
          field.onChange(value);
          onChange?.(value);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// Switch --------------------------------------------------------------------------------------

export type UnicornialSwitchProps = Omit<SwitchProps, "name" | "checked"> & FormFieldProps;

export function UnicornialSwitch({
  name,
  validator,
  defaultChecked,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialSwitchProps) {
  const field = useFormField<boolean>(name, validator, defaultChecked ?? false);

  return (
    <div className="mb-4 last:mb-0">
      <Switch
        {...props}
        name={name}
        themeVariant={themeVariant}
        checked={field.value}
        disabled={disabled || field.disabled}
        onChange={(checked) => {
          field.onChange(checked);
          onChange?.(checked);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// Spinner -------------------------------------------------------------------------------------

export type UnicornialSpinnerProps = Omit<SpinnerProps, "name" | "value"> & FormFieldProps;

export function UnicornialSpinner({
  name,
  validator,
  defaultValue,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialSpinnerProps) {
  const min = props.min ?? -Infinity;
  const field = useFormField<number>(name, validator, defaultValue ?? (min === -Infinity ? 0 : min));

  return (
    <div>
      <Spinner
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(value) => {
          field.onChange(value);
          onChange?.(value);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// Slider --------------------------------------------------------------------------------------

export type UnicornialSliderProps = Omit<SliderProps, "name" | "value"> & FormFieldProps;

export function UnicornialSlider({
  name,
  validator,
  defaultValue,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialSliderProps) {
  const field = useFormField<number>(name, validator, defaultValue ?? props.min ?? 0);

  return (
    <div>
      <Slider
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(value) => {
          field.onChange(value);
          onChange?.(value);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// RadioGroup ----------------------------------------------------------------------------------

export type UnicornialRadioGroupProps = Omit<RadioGroupProps, "name" | "value"> & FormFieldProps;

export function UnicornialRadioGroup({
  name,
  validator,
  defaultValue,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialRadioGroupProps) {
  const field = useFormField<string>(name, validator, defaultValue ?? "");

  return (
    <div>
      <RadioGroup
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(value) => {
          field.onChange(value);
          onChange?.(value);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// ColorPicker ---------------------------------------------------------------------------------

export type UnicornialColorPickerProps = Omit<ColorPickerProps, "name" | "value"> & FormFieldProps;

export function UnicornialColorPicker({
  name,
  validator,
  defaultValue,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialColorPickerProps) {
  const field = useFormField<string>(name, validator, defaultValue ?? "#aa3bff");

  return (
    <div>
      <ColorPicker
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(hex) => {
          field.onChange(hex);
          onChange?.(hex);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// DatePicker ----------------------------------------------------------------------------------

export type UnicornialDatePickerProps = Omit<DatePickerProps, "name" | "value"> & FormFieldProps;

export function UnicornialDatePicker({
  name,
  validator,
  defaultValue,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialDatePickerProps) {
  const field = useFormField<string>(name, validator, defaultValue ?? "");

  return (
    <div>
      <DatePicker
        {...props}
        name={name}
        themeVariant={themeVariant}
        value={field.value}
        disabled={disabled || field.disabled}
        onChange={(date) => {
          field.onChange(date);
          onChange?.(date);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// FileInput -----------------------------------------------------------------------------------

export type UnicornialFileInputProps = Omit<FileInputProps, "name"> & FormFieldProps;

/** The form value is the array of chosen `File`s. */
export function UnicornialFileInput({
  name,
  validator,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialFileInputProps) {
  const field = useFormField<File[]>(name, validator, []);

  return (
    <div>
      <FileInput
        {...props}
        name={name}
        themeVariant={themeVariant}
        disabled={disabled || field.disabled}
        onChange={(files) => {
          field.onChange(files);
          onChange?.(files);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}

// ImageInput ----------------------------------------------------------------------------------

export type UnicornialImageInputProps = Omit<ImageInputProps, "name"> & FormFieldProps;

/** The form value is the chosen image `File`, or `null`. */
export function UnicornialImageInput({
  name,
  validator,
  onChange,
  disabled,
  themeVariant,
  ...props
}: UnicornialImageInputProps) {
  const field = useFormField<File | null>(name, validator, null);

  return (
    <div>
      <ImageInput
        {...props}
        name={name}
        themeVariant={themeVariant}
        disabled={disabled || field.disabled}
        onChange={(file) => {
          field.onChange(file);
          onChange?.(file);
        }}
      />
      <FieldError message={field.message} themeVariant={themeVariant} />
    </div>
  );
}
