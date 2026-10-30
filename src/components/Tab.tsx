import type React from "react";
import { Children, useState, type HTMLAttributes } from "react";
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

interface TabProps extends HTMLAttributes<HTMLDivElement> {
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

  const handleChange = (index: number) => {
    setSelected(index);
    if (onChange) onChange(index);
  };

  return (
    <div className={[tabsOrientationClasses[orientation], className].join(" ")} style={style}>
      {Children.map(children, (child, index) => (
        <Tab
          variant={variant}
          themeVariant={themeVariant}
          onClick={() => handleChange(index)}
          selected={selected == index}
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
    <div
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
    </div>
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
