import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Field } from "./Field";
import { cx, useVariant } from "../theme/variants";

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
  const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <Field
      label={
        label && showValue && !indeterminate ? (
          <span className="flex justify-between">
            <span>{label}</span>
            <span className="font-normal opacity-70">{Math.round(percent)}%</span>
          </span>
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
        className={cx("relative h-2 w-full overflow-hidden rounded-full mb-2 last:mb-0", track.className)}
        style={{ backgroundColor: currentColors.border, ...track.style, ...style }}
      >
        <div
          className={cx("h-full rounded-full", bar.className)}
          style={
            indeterminate
              ? {
                  position: "absolute",
                  width: "40%",
                  backgroundColor: currentColors.primary,
                  animation: "progress-indeterminate 1.2s ease-in-out infinite",
                  ...bar.style,
                }
              : {
                  width: `${percent}%`,
                  backgroundColor: currentColors.primary,
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
