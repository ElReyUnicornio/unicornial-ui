import type { CSSProperties, ReactNode } from "react";
import type { DeepPartial } from "../utils/typeUtils";

export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  border: string;
  header: {
    background: string;
    border: string;
  };
}

export interface ThemeDark {
  enabled: boolean;
  colors: ThemeColors;
}

/** Tailwind classes applied to each kind of text. */
export interface ThemeText {
  title: string;
  subtitle: string;
  paragraph: string;
}

export type NotificationPosition =
  | "top-left"
  | "top"
  | "top-right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export interface ThemeNotifications {
  position: NotificationPosition;
}

/** Components that can be restyled by a variant. */
export type ComponentName =
  | "surface"
  | "button"
  | "input"
  | "header"
  | "modal"
  | "alertDialog"
  | "alert"
  | "toast"
  | "tooltip"
  | "tab"
  | "separator"
  | "dropdown"
  | "select"
  | "switch"
  | "spinner"
  | "slider"
  | "radio"
  | "progressBar"
  | "imageInput"
  | "datePicker"
  | "colorPicker"
  | "drawer"
  | "accordion"
  | "sidebar";

/** Tailwind classes and/or inline CSS for one part of a component. */
export interface StyleDef {
  className?: string;
  style?: CSSProperties;
}

/** Part name (e.g. "root", "label", "field") -> its styles. */
export type ComponentVariant = Record<string, StyleDef>;

/** variants[name][component][part], e.g. variants.glass.input.label */
export type ThemeVariant = Partial<Record<ComponentName, ComponentVariant>>;

export interface ThemeConfig {
  colors: ThemeColors;
  dark: ThemeDark;
  text: ThemeText;
  notifications: ThemeNotifications;
  variants: Record<string, ThemeVariant>;
  /** Environment values. `apiUrl` is the base url used by the http wrappers. */
  env: { apiUrl: string; [key: string]: string };
}

export interface ThemeContextValue extends ThemeConfig {
  /** True when a ThemeProvider is mounted. */
  enabled: boolean;
  /** Colors for the active mode (light or dark). */
  currentColors: ThemeColors;
  setColors: (colors: DeepPartial<ThemeColors>) => void;
  setDark: (dark: DeepPartial<ThemeDark>) => void;
  setDarkMode: (enabled: boolean) => void;
  setText: (text: Partial<ThemeText>) => void;
  setNotifications: (notifications: Partial<ThemeNotifications>) => void;
  setVariant: (name: string, variant: ThemeVariant) => void;
  setTheme: (config: DeepPartial<ThemeConfig>) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  config?: DeepPartial<ThemeConfig>;
}
