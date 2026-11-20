import { useId, useState, type KeyboardEvent } from "react";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { Minus, Plus } from "./icons";
import { useControllable } from "../hooks/useControllable";
import { cx, useVariant } from "../theme/variants";
import { clamp as clampTo, decimals } from "../utils/number";

export interface SpinnerProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  variant?: FieldVariant;
  /** Name of a variant defined in the theme config (variants[name].spinner.button and input.*). */
  themeVariant?: string;
  className?: string;
}

/** Numeric input with decrement and increment buttons. */
export function Spinner({
  value,
  defaultValue,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  name,
  id,
  disabled,
  variant = "default",
  themeVariant,
  className = "",
}: SpinnerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const styles = useFieldStyles(themeVariant, variant);
  const button = useVariant("spinner", themeVariant)("button");

  const clamp = (n: number) => clampTo(n, min, max);
  const [current, setCurrent] = useControllable(
    value,
    clamp(defaultValue ?? (min === -Infinity ? 0 : min)),
    onChange,
  );
  // Text being typed; null when the input just mirrors the value.
  const [draft, setDraft] = useState<string | null>(null);

  const precision = Math.max(decimals(step), decimals(current));
  const stepBy = (direction: 1 | -1) => {
    setDraft(null);
    setCurrent(clamp(Number((current + direction * step).toFixed(precision))));
  };

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.-]/g, "");
    setDraft(cleaned);
    const parsed = Number(cleaned);
    if (cleaned !== "" && cleaned !== "-" && cleaned !== "." && !Number.isNaN(parsed)) {
      setCurrent(clamp(parsed));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      stepBy(event.key === "ArrowUp" ? 1 : -1);
    }
  };

  const buttonClass = cx(
    "flex items-center justify-center w-7 h-7 rounded-md cursor-pointer shrink-0",
    "hover:bg-hover disabled:opacity-40 disabled:pointer-events-none",
    button.className,
  );

  return (
    <Field label={label} htmlFor={inputId} themeVariant={themeVariant} className={className}>
      <div
        className={cx(
          "mb-4 last:mb-0 flex items-center gap-1 focus-within:ring-2 focus-within:ring-focus/40 focus-within:border-focus",
          styles.fieldClass,
          disabled && "opacity-50 pointer-events-none",
        )}
        style={styles.fieldStyle}
      >
        <button
          type="button"
          aria-label="Decrease"
          disabled={disabled || current <= min}
          onClick={() => stepBy(-1)}
          className={buttonClass}
          style={button.style}
        >
          <Minus size={16} />
        </button>
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={current}
          aria-valuemin={min === -Infinity ? undefined : min}
          aria-valuemax={max === Infinity ? undefined : max}
          disabled={disabled}
          value={draft ?? String(current)}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={() => setDraft(null)}
          onKeyDown={handleKeyDown}
          className={cx("min-w-0 flex-1 bg-transparent text-center sm:text-sm", FOCUS_RING.split(" ")[0])}
        />
        <button
          type="button"
          aria-label="Increase"
          disabled={disabled || current >= max}
          onClick={() => stepBy(1)}
          className={buttonClass}
          style={button.style}
        >
          <Plus size={16} />
        </button>
      </div>
    </Field>
  );
}

export default Spinner;
