import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { useControllable } from "../hooks/useControllable";
import { cx, useVariant } from "../theme/variants";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "children"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  name?: string;
  /** Name of a variant defined in the theme config (variants[name].switch.{track,thumb}). */
  themeVariant?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  name,
  themeVariant,
  disabled,
  className = "",
  style,
  ...props
}: SwitchProps) {
  const { currentColors } = useTheme();
  const themed = useVariant("switch", themeVariant);
  const track = themed("track");
  const thumb = themed("thumb");
  const [isOn, setOn] = useControllable(checked, defaultChecked, onChange);

  return (
    <label
      className={cx(
        "inline-flex items-center gap-2 select-none",
        disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
        className,
      )}
      style={{ color: currentColors.text }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        {...props}
        onClick={(event) => {
          props.onClick?.(event);
          setOn(!isOn);
        }}
        className={cx(
          "relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/50",
          track.className,
        )}
        style={{
          backgroundColor: isOn ? currentColors.primary : currentColors.border,
          ...track.style,
          ...style,
        }}
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
            thumb.className,
          )}
          style={{ transform: isOn ? "translateX(20px)" : "translateX(0)", ...thumb.style }}
        />
      </button>
      {label && <span>{label}</span>}
      {name && <input type="hidden" name={name} value={isOn ? "on" : ""} />}
    </label>
  );
}

export default Switch;
