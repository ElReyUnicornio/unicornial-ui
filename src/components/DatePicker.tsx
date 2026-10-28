import { useId, useRef, useState } from "react";
import { Dropdown } from "./Dropdown";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { CalendarIcon, ChevronLeft, ChevronRight } from "./icons";
import { useControllable } from "../hooks/useControllable";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";
import { daysInMonth, formatDate, parseIso, toIso, todayIso } from "../utils/date";

export interface DatePickerProps {
  /** Date as YYYY-MM-DD. */
  value?: string;
  defaultValue?: string;
  /** Always receives the date as YYYY-MM-DD, whatever `format` is. */
  onChange?: (value: string) => void;
  /** Display format. Tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D. Default "YYYY-MM-DD". */
  format?: string;
  /** Locale for month and weekday names. */
  locale?: string;
  /** 0 = Sunday, 1 = Monday... */
  weekStartsOn?: number;
  /** Limits, as YYYY-MM-DD. */
  min?: string;
  max?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  variant?: FieldVariant;
  /** Name of a variant defined in the theme config (variants[name].datePicker.{day,daySelected} and input.*). */
  themeVariant?: string;
  className?: string;
}

export function DatePicker({
  value,
  defaultValue = "",
  onChange,
  format = "YYYY-MM-DD",
  locale,
  weekStartsOn = 0,
  min,
  max,
  placeholder = "Select a date",
  label,
  name,
  id,
  disabled,
  variant = "default",
  themeVariant,
  className = "",
}: DatePickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const { currentColors } = useTheme();
  const styles = useFieldStyles(themeVariant, variant);
  const themed = useVariant("datePicker", themeVariant);
  const dayVariant = themed("day");
  const selectedVariant = themed("daySelected");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [date, setDate] = useControllable(value, defaultValue, onChange);
  const [open, setOpen] = useState(false);

  const selected = parseIso(date);
  const today = todayIso();
  const [view, setView] = useState(() => {
    const base = selected ?? parseIso(today)!;
    return { year: base.year, month: base.month };
  });

  const showMonth = (offset: number) => {
    const next = new Date(view.year, view.month + offset, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  };

  const toggle = () => {
    if (!open) {
      const base = selected ?? parseIso(today)!;
      setView({ year: base.year, month: base.month });
    }
    setOpen(!open);
  };

  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(view.year, view.month, 1),
  );
  // 2023-01-01 was a Sunday, so day index 1 + offset gives the weekday name.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2023, 0, 1 + ((i + weekStartsOn) % 7)),
    ),
  );

  const leading =
    (new Date(view.year, view.month, 1).getDay() - weekStartsOn + 7) % 7;
  const cells: (number | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth(view.year, view.month) }, (_, i) => i + 1),
  ];

  const isDisabled = (iso: string) => (min !== undefined && iso < min) || (max !== undefined && iso > max);

  return (
    <Field label={label} htmlFor={triggerId} themeVariant={themeVariant} className={className}>
      <div className="mb-4 last:mb-0">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={toggle}
          className={cx(
            "flex w-full items-center justify-between gap-2 text-left sm:text-sm cursor-pointer",
            "disabled:opacity-50 disabled:pointer-events-none",
            styles.fieldClass,
            FOCUS_RING,
          )}
          style={styles.fieldStyle}
        >
          <span className={selected ? "" : "opacity-50"}>
            {selected ? formatDate(date, format, locale) : placeholder}
          </span>
          <CalendarIcon />
        </button>
        {name && <input type="hidden" name={name} value={date} />}
        <Dropdown
          anchorRef={triggerRef}
          open={open}
          onClose={() => setOpen(false)}
          role="dialog"
          themeVariant={themeVariant}
          className="p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => showMonth(-1)}
              className="p-1 rounded-md cursor-pointer hover:bg-black/10"
            >
              <ChevronLeft />
            </button>
            <span className="font-semibold capitalize" aria-live="polite">
              {monthTitle}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => showMonth(1)}
              className="p-1 rounded-md cursor-pointer hover:bg-black/10"
            >
              <ChevronRight />
            </button>
          </div>
          <div role="grid" className="grid grid-cols-7 gap-1 text-center text-sm">
            {weekdays.map((weekday) => (
              <span key={weekday} className="py-1 text-xs font-bold opacity-60">
                {weekday}
              </span>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} />;
              const iso = toIso(view.year, view.month, day);
              const isSelected = iso === date;
              const isToday = iso === today;
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  disabled={isDisabled(iso)}
                  onClick={() => {
                    setDate(iso);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={cx(
                    "w-8 h-8 rounded-md cursor-pointer disabled:opacity-30 disabled:pointer-events-none",
                    !isSelected && "hover:bg-black/10",
                    dayVariant.className,
                    isSelected && selectedVariant.className,
                  )}
                  style={{
                    backgroundColor: isSelected ? currentColors.primary : undefined,
                    color: isSelected ? "#fff" : undefined,
                    fontWeight: isSelected || isToday ? 700 : undefined,
                    boxShadow:
                      isToday && !isSelected ? `inset 0 0 0 1px ${currentColors.primary}` : undefined,
                    ...dayVariant.style,
                    ...(isSelected ? selectedVariant.style : undefined),
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Dropdown>
      </div>
    </Field>
  );
}

export default DatePicker;
