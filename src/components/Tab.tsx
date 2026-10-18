import type React from "react";
import { Children, useState, type HTMLAttributes } from "react";
import { useTheme } from "../theme/ThemeProvider";

interface TabsContainerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "underline" | "pills";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onChange?: (index: number) => void;
}

interface TabProps extends HTMLAttributes<HTMLDivElement> {
  variant: "underline" | "pills";
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
        <Tab variant={variant} onClick={() => handleChange(index)} selected={selected == index}>
          {child}
        </Tab>
      ))}
    </div>
  );
}

function Tab({ variant, children, selected, ...props }: TabProps) {
  const theme = useTheme();
  return (
    <div
      className="px-2 py-1 border-b-4 border-transparent cursor-pointer"
      {...props}
      style={{
        color: selected ? theme.colors.primary : "#999999",
        fontWeight: selected ? "bold" : "normal",
        borderColor: selected ? theme.colors.primary : "transparent",
        backgroundColor: variant === "underline" ? "transparent" : theme.colors.primary,
      }}
    >
      {children}
    </div>
  );
}

function Item({ children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className="text-inherit" {...props}>{children}</span>;
}

export const TabsNamespace = Object.assign(Tabs, {
  Item,
});

export default TabsNamespace;
