import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Field, LabelWithValue } from "./Field";
import { cx, useVariant } from "../theme/variants";
import { clamp } from "../utils/number";

export interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  /** Shows the percentage next to the label. */
  showValue?: boolean;
  /** Ignores `value` and shows a looping animation. */
  indeterminate?: boolean;
  /** Name of a variant defined in the theme config (variants[name].progressBar.{track,bar}). */
  themeVariant?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue,
  indeterminate,
  themeVariant,
  className = "",
  style,
}: ProgressBarProps) {
  const { currentColors } = useTheme();
  const themed = useVariant("progressBar", themeVariant);
  const track = themed("track");
  const bar = themed("bar");
  const gradient = `linear-gradient(to right, ${currentColors.primary}, var(--theme-primary-gradient))`;
  const percent = max <= 0 ? 0 : clamp((value / max) * 100, 0, 100);

  return (
    <Field
      label={
        label && showValue && !indeterminate ? (
          <LabelWithValue label={label}>{Math.round(percent)}%</LabelWithValue>
        ) : (
          label
        )
      }
      themeVariant={themeVariant}
      className={className}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        aria-label={label}
        className={cx(
          "relative h-2 w-full overflow-hidden rounded-full mb-2 last:mb-0",
          track.className,
        )}
        style={{ backgroundColor: currentColors.border, ...track.style, ...style }}
      >
        <div
          className={cx("h-full rounded-full", bar.className)}
          style={
            indeterminate
              ? {
                  position: "absolute",
                  width: "40%",
                  background: gradient,
                  animation: "progress-indeterminate 1.2s ease-in-out infinite",
                  ...bar.style,
                }
              : {
                  width: `${percent}%`,
                  background: gradient,
                  transition: "width 200ms ease",
                  ...bar.style,
                }
          }
        />
      </div>
    </Field>
  );
}

export default ProgressBar;
