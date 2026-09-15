import type { ReactNode } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  border: string;
  header: {
    background: string;
    border: string;
  }
}

export interface ThemeTextClasses {
  title: string;
  subtitle: string;
  normal: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  darkColors: ThemeColors;
  darkMode: boolean;
  text: ThemeTextClasses;
}

export interface ThemeContextValue extends ThemeConfig {
  enabled: boolean;
  setColors: (colors: Partial<ThemeColors>) => void;
  setDarkColors: (colors: Partial<ThemeColors>) => void;
  setDarkMode: (enabled: boolean) => void;
  setText: (text: Partial<ThemeTextClasses>) => void;
  setTheme: (config: Partial<ThemeConfig>) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  config?: Partial<ThemeConfig>;
}