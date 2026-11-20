import type React from "react";
import type { ButtonHTMLAttributes } from "react";
import { Children, useRef, useState, type HTMLAttributes, type KeyboardEvent } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

interface TabsContainerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "underline" | "pills";
  className?: string;
  style?: React.CSSProperties;
  /** Name of a variant defined in the theme config (variants[name].tab.{root,selected}). */
  themeVariant?: string;
  children?: React.ReactNode;
  onChange?: (index: number) => void;
}

interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant: "underline" | "pills";
  themeVariant?: string;
  children?: React.ReactNode;
  selected: boolean;
}

const tabsOrientationClasses: Record<"horizontal" | "vertical", string> = {
  horizontal: "flex flex-row",
  vertical: "flex flex-col",
};

function Tabs({
  orientation = "horizontal",
  variant = "underline",
  className = "",
  style,
  themeVariant,
  children,
  onChange,
}: TabsContainerProps) {
  const [selected, setSelected] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const horizontal = orientation === "horizontal";

  const select = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  // Selection follows focus; arrows move along the tab axis, Home/End jump to the ends.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
    const target =
      event.key === prevKey
        ? (selected - 1 + count) % count
        : event.key === nextKey
          ? (selected + 1) % count
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : -1;
    if (target < 0) return;
    event.preventDefault();
    select(target);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={cx(tabsOrientationClasses[orientation], className)}
      style={style}
    >
      {Children.map(children, (child, index) => (
        <Tab
          variant={variant}
          themeVariant={themeVariant}
          onClick={() => select(index)}
          selected={selected === index}
        >
          {child}
        </Tab>
      ))}
    </div>
  );
}

function Tab({ variant, themeVariant, children, selected, ...props }: TabProps) {
  const { currentColors } = useTheme();
  const themed = useVariant("tab", themeVariant);
  const root = themed("root");
  const active = selected ? themed("selected") : undefined;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      // Roving tabindex: only the selected tab is in the tab order.
      tabIndex={selected ? 0 : -1}
      className={cx(
        "px-3 py-1.5 border-b-2 border-transparent cursor-pointer rounded-t-md transition-colors",
        root.className,
        active?.className,
      )}
      {...props}
      style={{
        color: selected
          ? currentColors.primary
          : "color-mix(in srgb, var(--theme-text) 55%, transparent)",
        fontWeight: selected ? 600 : 500,
        borderColor: selected ? currentColors.primary : "transparent",
        backgroundColor:
          variant === "pills" && selected
            ? "color-mix(in srgb, var(--theme-primary) 10%, transparent)"
            : "transparent",
        ...root.style,
        ...active?.style,
      }}
    >
      {children}
    </button>
  );
}

function Item({ children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="text-inherit" {...props}>
      {children}
    </span>
  );
}

export const TabsNamespace = Object.assign(Tabs, {
  Item,
});

export default TabsNamespace;
