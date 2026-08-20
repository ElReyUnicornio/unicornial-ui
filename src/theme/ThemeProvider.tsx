import {
  createContext,
  useContext,
  type ReactNode,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import defaultConfig from "./theme.config.json";

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export interface ThemeTextClasses {
  title: string;
  subtitle: string;
  normal: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  darkMode: boolean;
  text: ThemeTextClasses;
}

export interface ThemeContextValue extends ThemeConfig {
  enabled: boolean;
  setColors: (colors: Partial<ThemeColors>) => void;
  setDarkMode: (enabled: boolean) => void;
  setText: (text: Partial<ThemeTextClasses>) => void;
  setTheme: (config: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  config?: Partial<ThemeConfig>;
}

const deepMerge = <T extends object>(base: T, overrides: Partial<T>): T => {
  const result: any = { ...base };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const value = overrides[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(base[key] as any, value as any);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
};

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  const mergedInitial = useMemo(
    () => deepMerge(defaultConfig as ThemeConfig, config ?? {}),
    [config],
  );

  const [colors, setColorsState] = useState<ThemeColors>(mergedInitial.colors);
  const [darkMode, setDarkModeState] = useState<boolean>(mergedInitial.darkMode);
  const [text, setTextState] = useState<ThemeTextClasses>(mergedInitial.text);

  const setColors = useCallback((partial: Partial<ThemeColors>) => {
    setColorsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    setDarkModeState(enabled);
  }, []);

  const setText = useCallback((partial: Partial<ThemeTextClasses>) => {
    setTextState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setTheme = useCallback((partial: Partial<ThemeConfig>) => {
    if (partial.colors) setColorsState((prev) => ({ ...prev, ...partial.colors! }));
    if (partial.darkMode !== undefined) setDarkModeState(partial.darkMode);
    if (partial.text) setTextState((prev) => ({ ...prev, ...partial.text! }));
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty("--theme-secondary", colors.secondary);
  }, [colors, darkMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      enabled: true,
      colors,
      darkMode,
      text,
      setColors,
      setDarkMode,
      setText,
      setTheme,
    }),
    [colors, darkMode, text, setColors, setDarkMode, setText, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      enabled: false,
      colors: defaultConfig.colors as ThemeColors,
      darkMode: defaultConfig.darkMode,
      text: defaultConfig.text as ThemeTextClasses,
      setColors: () => {},
      setDarkMode: () => {},
      setText: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
}

export { defaultConfig as themeConfig };
