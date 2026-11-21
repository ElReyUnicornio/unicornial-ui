import {
  createContext,
  useCallback,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useControllable } from "../hooks/useControllable";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

interface AccordionContextValue {
  open: string[];
  toggle: (value: string) => void;
  themeVariant?: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** "single" keeps one item open at a time. */
  type?: "single" | "multiple";
  /** Values of the open items. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Name of a variant defined in the theme config (variants[name].accordion.{root,item,header,body}). */
  themeVariant?: string;
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  value: string;
  title: ReactNode;
  disabled?: boolean;
}

function Accordion({
  type = "single",
  value,
  defaultValue = [],
  onValueChange,
  themeVariant,
  className = "",
  style,
  children,
  ...props
}: AccordionProps) {
  const { currentColors } = useTheme();
  const root = useVariant("accordion", themeVariant)("root");
  const [open, setOpen] = useControllable<string[]>(value, defaultValue, onValueChange);

  const toggle = useCallback(
    (item: string) => {
      if (open.includes(item)) setOpen(open.filter((v) => v !== item));
      else setOpen(type === "single" ? [item] : [...open, item]);
    },
    [open, setOpen, type],
  );

  return (
    <AccordionContext.Provider value={{ open, toggle, themeVariant }}>
      <div
        {...props}
        className={cx(
          "w-full rounded-md border overflow-hidden shadow-sm",
          root.className,
          className,
        )}
        style={{ borderColor: currentColors.border, ...root.style, ...style }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function Item({
  value,
  title,
  disabled,
  className = "",
  style,
  children,
  ...props
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion.Item must be used inside <Accordion>");
  const { currentColors } = useTheme();
  const themed = useVariant("accordion", context.themeVariant);
  const item = themed("item");
  const header = themed("header");
  const body = themed("body");
  const id = useId();
  const isOpen = context.open.includes(value);

  return (
    <div
      {...props}
      className={cx("border-b last:border-b-0", item.className, className)}
      style={{ borderColor: currentColors.border, ...item.style, ...style }}
    >
      <button
        type="button"
        id={`${id}-header`}
        aria-expanded={isOpen}
        aria-controls={`${id}-body`}
        disabled={disabled}
        onClick={() => context.toggle(value)}
        className={cx(
          "w-full flex items-center justify-between gap-2 px-4 py-3 text-left font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover",
          header.className,
        )}
        style={{ color: currentColors.text, ...header.style }}
      >
        <span>{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-200 motion-reduce:transition-none"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id={`${id}-body`}
        role="region"
        aria-labelledby={`${id}-header`}
        className="grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden" inert={!isOpen}>
          <div
            className={cx("px-4 py-3", body.className)}
            style={{ color: currentColors.text, ...body.style }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export const AccordionNamespace = Object.assign(Accordion, { Item });

export default AccordionNamespace;
