import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useControllable } from "../hooks/useControllable";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  themeVariant?: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar parts must be used inside <Sidebar>");
  return context;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Name of a variant defined in the theme config (variants[name].sidebar.{root,header,button}). */
  themeVariant?: string;
}

export interface SidebarHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  /** Shows a button that collapses and expands the sidebar. */
  collapsible?: boolean;
}

export interface SidebarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  active?: boolean;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    themeVariant,
    className = "",
    style,
    children,
    ...props
  },
  ref,
) {
  const { enabled, currentColors } = useTheme();
  const themed = useVariant("sidebar", themeVariant)("root");
  const [isCollapsed, setCollapsed] = useControllable(
    collapsed,
    defaultCollapsed,
    onCollapsedChange,
  );
  const context = useMemo(
    () => ({ collapsed: isCollapsed, toggle: () => setCollapsed(!isCollapsed), themeVariant }),
    [isCollapsed, setCollapsed, themeVariant],
  );

  const themeStyle = enabled
    ? {
        backgroundColor: currentColors.header.background,
        borderRightWidth: 1,
        borderRightStyle: "solid" as const,
        borderRightColor: currentColors.header.border,
        color: currentColors.text,
      }
    : undefined;

  return (
    <SidebarContext.Provider value={context}>
      <aside
        ref={ref}
        {...props}
        className={cx(
          "h-full flex flex-col gap-1 p-2 shrink-0 overflow-hidden transition-[width] duration-200",
          isCollapsed ? "w-16" : "w-60",
          themed.className,
          className,
        )}
        style={{ ...themeStyle, ...themed.style, ...style }}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
});

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(function SidebarHeader(
  { title, collapsible = true, className = "", style, children, ...props },
  ref,
) {
  const { collapsed, toggle, themeVariant } = useSidebar();
  const themed = useVariant("sidebar", themeVariant)("header");

  return (
    <div
      ref={ref}
      {...props}
      className={cx(
        "flex items-center gap-2 h-12 px-2 mb-1 shrink-0",
        collapsed ? "justify-center" : "justify-between",
        themed.className,
        className,
      )}
      style={{ ...themed.style, ...style }}
    >
      {!collapsed && (
        <div className="flex items-center gap-2 min-w-0 text-lg font-bold truncate">
          {children}
          {title}
        </div>
      )}
      {collapsible && (
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={toggle}
          className="shrink-0 p-1 rounded-md cursor-pointer opacity-60 hover:opacity-100 hover:bg-hover"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
});

const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(function SidebarButton(
  { icon, active = false, className = "", style, children, ...props },
  ref,
) {
  const { collapsed, themeVariant } = useSidebar();
  const { enabled, currentColors } = useTheme();
  const themed = useVariant("sidebar", themeVariant)("button");

  const themeStyle = enabled
    ? {
        color: active ? currentColors.primary : currentColors.text,
        backgroundColor: active ? `${currentColors.primary}1a` : undefined,
        "--tw-ring-color": `${currentColors.primary}80`,
      }
    : undefined;

  return (
    <button
      ref={ref}
      type="button"
      aria-current={active ? "page" : undefined}
      title={collapsed && typeof children === "string" ? children : props.title}
      {...props}
      className={cx(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer select-none transition-colors duration-200 hover:bg-hover focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
        collapsed && "justify-center",
        themed.className,
        className,
      )}
      style={{ ...themeStyle, ...themed.style, ...style }}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {!collapsed && <span className="truncate">{children}</span>}
    </button>
  );
});

const SidebarNamespace = Object.assign(Sidebar, { Header: SidebarHeader, Button: SidebarButton });

export default SidebarNamespace;
