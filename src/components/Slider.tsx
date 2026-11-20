import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useTheme } from "../theme/ThemeProvider";
import { useControllable } from "../hooks/useControllable";
import { Field, LabelWithValue } from "./Field";
import { cx, useVariant } from "../theme/variants";
import { clamp, decimals } from "../utils/number";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  name?: string;
  disabled?: boolean;
  /** Shows the current value next to the label. */
  showValue?: boolean;
  /** Replaces the track background (and hides the filled part), e.g. a gradient. */
  trackBackground?: string;
  /** Format for the displayed value / aria-valuetext. */
  formatValue?: (value: number) => ReactNode;
  /** Name of a variant defined in the theme config (variants[name].slider.{track,fill,thumb}). */
  themeVariant?: string;
  className?: string;
  style?: CSSProperties;
}

export function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  name,
  disabled,
  showValue,
  trackBackground,
  formatValue,
  themeVariant,
  className = "",
  style,
}: SliderProps) {
  const { currentColors } = useTheme();
  const themed = useVariant("slider", themeVariant);
  const track = themed("track");
  const fill = themed("fill");
  const thumb = themed("thumb");
  const [current, setCurrent] = useControllable(value, defaultValue ?? min, onChange);
  const trackRef = useRef<HTMLDivElement>(null);

  const precision = decimals(step);
  const snap = (n: number) =>
    clamp(Number((Math.round((n - min) / step) * step + min).toFixed(precision)), min, max);
  const ratio = max === min ? 0 : (current - min) / (max - min);

  const setFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = snap(min + ((event.clientX - rect.left) / rect.width) * (max - min));
    if (next !== current) setCurrent(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const big = Math.max(step, (max - min) / 10);
    const moves: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      PageUp: current + big,
      PageDown: current - big,
      Home: min,
      End: max,
    };
    if (event.key in moves) {
      event.preventDefault();
      setCurrent(snap(moves[event.key]));
    }
  };

  return (
    <Field
      label={
        label && showValue ? (
          <LabelWithValue label={label}>{formatValue ? formatValue(current) : current}</LabelWithValue>
        ) : (
          label
        )
      }
      themeVariant={themeVariant}
      className={className}
    >
      <div
        className={cx("py-3 mb-2 last:mb-0", disabled && "opacity-50 pointer-events-none")}
        style={style}
      >
        <div
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-valuetext={formatValue ? String(formatValue(current)) : undefined}
          aria-label={typeof label === "string" ? label : undefined}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event);
          }}
          className={cx(
            "relative h-2 rounded-full cursor-pointer touch-none",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-accent/50",
            track.className,
          )}
          style={{ background: trackBackground ?? currentColors.border, ...track.style }}
        >
          {!trackBackground && (
            <div
              className={cx("absolute inset-y-0 left-0 rounded-full", fill.className)}
              style={{
                width: `${ratio * 100}%`,
                background: `linear-gradient(to right, ${currentColors.primary}, var(--theme-primary-gradient))`,
                ...fill.style,
              }}
            />
          )}
          <div
            aria-hidden="true"
            className={cx(
              "absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 shadow",
              thumb.className,
            )}
            style={{
              left: `${ratio * 100}%`,
              transform: "translate(-50%, -50%)",
              borderColor: trackBackground ? currentColors.border : currentColors.primary,
              ...thumb.style,
            }}
          />
        </div>
        {name && <input type="hidden" name={name} value={current} />}
      </div>
    </Field>
  );
}

export default Slider;
