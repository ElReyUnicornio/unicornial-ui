import { createContext, useContext, useId, type ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { useControllable } from "../hooks/useControllable";
import { Field } from "./Field";
import { cx, useVariant } from "../theme/variants";

interface RadioGroupContext {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  themeVariant?: string;
}

const GroupContext = createContext<RadioGroupContext | null>(null);

export interface RadioProps {
  value: string;
  label?: ReactNode;
  /** Required outside a RadioGroup. */
  checked?: boolean;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  /** Name of a variant defined in the theme config (variants[name].radio.{control,dot}). */
  themeVariant?: string;
  className?: string;
}

export function Radio({
  value,
  label,
  checked,
  onChange,
  name,
  disabled,
  themeVariant,
  className = "",
}: RadioProps) {
  const group = useContext(GroupContext);
  const { currentColors } = useTheme();
  const isChecked = group ? group.value === value : !!checked;
  const isDisabled = disabled || group?.disabled;
  const themed = useVariant("radio", themeVariant ?? group?.themeVariant);
  const control = themed("control");
  const dot = themed("dot");

  return (
    <label
      className={cx(
        "inline-flex items-center gap-2 select-none",
        isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
        className,
      )}
      style={{ color: currentColors.text }}
    >
      <input
        type="radio"
        className="peer sr-only"
        name={name ?? group?.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => (group ? group.onChange(value) : onChange?.(value))}
      />
      <span
        aria-hidden="true"
        className={cx(
          "flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent/50",
          control.className,
        )}
        style={{
          borderColor: isChecked ? currentColors.primary : currentColors.border,
          ...control.style,
        }}
      >
        <span
          className={cx("w-2.5 h-2.5 rounded-full transition-transform", dot.className)}
          style={{
            backgroundColor: currentColors.primary,
            transform: isChecked ? "scale(1)" : "scale(0)",
            ...dot.style,
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  themeVariant?: string;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  defaultValue = "",
  onChange,
  name,
  label,
  disabled,
  orientation = "vertical",
  themeVariant,
  className = "",
}: RadioGroupProps) {
  const generatedName = useId();
  const [selected, setSelected] = useControllable(value, defaultValue, onChange);

  return (
    <GroupContext.Provider
      value={{ name: name ?? generatedName, value: selected, onChange: setSelected, disabled, themeVariant }}
    >
      <Field label={label} themeVariant={themeVariant} className={className}>
        <div
          role="radiogroup"
          className={cx("flex gap-3 mb-4 last:mb-0", orientation === "vertical" && "flex-col")}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value} label={option.label} disabled={option.disabled} />
          ))}
        </div>
      </Field>
    </GroupContext.Provider>
  );
}

export default Radio;
