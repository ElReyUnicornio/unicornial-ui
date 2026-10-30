import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Dropdown } from "./Dropdown";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { ChevronDown } from "./icons";
import { useControllable } from "../hooks/useControllable";
import { cx, useVariant } from "../theme/variants";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  variant?: FieldVariant;
  /** Name of a variant defined in the theme config (variants[name].select.{option,optionActive} and input.*). */
  themeVariant?: string;
  className?: string;
}

/** Custom select: a button that opens a Dropdown with the list of options. */
export function Select({
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Select...",
  label,
  name,
  id,
  disabled,
  variant = "default",
  themeVariant,
  className = "",
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listId = `${triggerId}-list`;
  const styles = useFieldStyles(themeVariant, variant);
  const themed = useVariant("select", themeVariant);
  const optionVariant = themed("option");
  const activeVariant = themed("optionActive");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [selected, setSelected] = useControllable(value, defaultValue, onChange);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const selectedOption = options.find((option) => option.value === selected);

  const enabledIndexes = options.flatMap((option, i) => (option.disabled ? [] : [i]));
  const move = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const position = enabledIndexes.indexOf(active);
    const next =
      position === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (position + direction + enabledIndexes.length) % enabledIndexes.length;
    setActive(enabledIndexes[next]);
  };

  const openList = () => {
    if (disabled) return;
    const index = options.findIndex((option) => option.value === selected);
    setActive(index >= 0 ? index : (enabledIndexes[0] ?? -1));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelected(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else move(event.key === "ArrowDown" ? 1 : -1);
        break;
      case "Home":
      case "End":
        if (open) {
          event.preventDefault();
          setActive(enabledIndexes[event.key === "Home" ? 0 : enabledIndexes.length - 1] ?? -1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Keep the highlighted option visible while navigating with the keyboard.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  return (
    <Field label={label} htmlFor={triggerId} themeVariant={themeVariant} className={className}>
      <div className="mb-4 last:mb-0">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
          className={cx(
            "flex w-full items-center justify-between gap-2 text-left sm:text-sm cursor-pointer",
            "disabled:opacity-50 disabled:pointer-events-none",
            styles.fieldClass,
            FOCUS_RING,
          )}
          style={styles.fieldStyle}
        >
          <span className={selectedOption ? "" : "opacity-50"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className="shrink-0 transition-transform"
            style={{ transform: open ? "rotate(180deg)" : undefined }}
          />
        </button>
        {name && <input type="hidden" name={name} value={selected} />}
        <Dropdown
          anchorRef={triggerRef}
          open={open}
          onClose={() => setOpen(false)}
          matchWidth
          themeVariant={themeVariant}
          className="overflow-hidden"
        >
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="max-h-60 overflow-auto py-1 sm:text-sm"
          >
            {options.map((option, index) => {
              const isActive = index === active;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === selected}
                  aria-disabled={option.disabled}
                  // Keep focus on the trigger so keyboard navigation continues to work.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => !option.disabled && setActive(index)}
                  onClick={() => choose(index)}
                  className={cx(
                    "px-3 py-1.5 cursor-pointer flex items-center justify-between gap-2",
                    option.disabled && "opacity-40 cursor-not-allowed",
                    option.value === selected && "font-semibold",
                    optionVariant.className,
                    isActive && activeVariant.className,
                  )}
                  style={{
                    backgroundColor: isActive
                      ? "color-mix(in srgb, var(--theme-primary) 10%, transparent)"
                      : undefined,
                    ...optionVariant.style,
                    ...(isActive ? activeVariant.style : undefined),
                  }}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </Dropdown>
      </div>
    </Field>
  );
}

export default Select;
