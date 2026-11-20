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

/** Tailwind classes and/or inline CSS for one part of a component. */
export interface StyleDef {
  className?: string;
  style?: CSSProperties;
}

type DialogParts = "backdrop" | "container" | "header" | "title" | "body";

/**
 * Every component that can be restyled by a variant, with the parts of each one.
 * A part is a piece of the component you can style: `variants.glass.input.label`.
 */
export interface ComponentParts {
  surface: "root";
  button: "root" | "primary" | "secondary" | "outline" | "ghost";
  input: "root" | "label" | "field";
  header: "root" | "navButton";
  modal: DialogParts;
  drawer: DialogParts;
  alertDialog: "backdrop" | "container" | "icon" | "message";
  alert: "root";
  toast: "root";
  tooltip: "root" | "arrow";
  tab: "root" | "selected";
  separator: "root";
  dropdown: "root";
  select: "option" | "optionActive";
  switch: "track" | "thumb";
  spinner: "button";
  slider: "track" | "fill" | "thumb";
  radio: "control" | "dot";
  progressBar: "track" | "bar";
  imageInput: "area";
  datePicker: "day" | "daySelected";
  colorPicker: "swatch";
  accordion: "root" | "item" | "header" | "body";
  sidebar: "root" | "header" | "button";
}

/** Components that can be restyled by a variant. */
export type ComponentName = keyof ComponentParts;

/** Part name -> its styles, for one component. Unknown parts are a type error. */
export type ComponentVariant<C extends ComponentName = ComponentName> = Partial<
  Record<ComponentParts[C], StyleDef>
>;

/** variants[name][component][part], e.g. variants.glass.input.label */
export type ThemeVariant = { [C in ComponentName]?: ComponentVariant<C> };

/** Everything visual: colors, text, notifications and the component variants. */
export interface ThemeConfig {
  colors: ThemeColors;
  dark: ThemeDark;
  text: ThemeText;
  notifications: ThemeNotifications;
  variants: Record<string, ThemeVariant>;
}

/** Environment values. `apiUrl` is the base url used by the http wrappers. */
export interface EnvConfig {
  apiUrl: string;
  [key: string]: string;
}

/** The whole library configuration: `theme` (visual) and `env` (runtime values). */
export interface UnicornialConfig {
  theme: ThemeConfig;
  env: EnvConfig;
}

export interface ThemeContextValue extends ThemeConfig {
  /** Environment values (see `UnicornialConfig.env`). */
  env: EnvConfig;
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
  setEnv: (env: Partial<EnvConfig>) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Overrides for the default `unicornialConfig`; `theme` and `env` are merged separately. */
  config?: DeepPartial<UnicornialConfig>;
}
