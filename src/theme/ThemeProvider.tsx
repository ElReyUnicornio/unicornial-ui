import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import defaultConfig from "./theme.config.json";
import type { ThemeConfig, ThemeContextValue, ThemeColors, ThemeTextClasses, ThemeProviderProps } from "./types";
import { deepMerge } from "../utils/typeUtils";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  const mergedInitial = useMemo(
    () => deepMerge(defaultConfig as ThemeConfig, config ?? {}),
    [config],
  ); 

  const [colors, setColorsState] = useState<ThemeColors>(mergedInitial.colors);
  const [darkColors, setDarkColorsState] = useState<ThemeColors>(mergedInitial.darkColors);

  const [darkMode, setDarkModeState] = useState<boolean>(mergedInitial.darkMode);
  const [text, setTextState] = useState<ThemeTextClasses>(mergedInitial.text);

  const setColors = useCallback((partial: Partial<ThemeColors>) => {
    setColorsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setDarkColors = useCallback((partial: Partial<ThemeColors>) => {
    setDarkColorsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    setDarkModeState(enabled);
  }, []);

  const setText = useCallback((partial: Partial<ThemeTextClasses>) => {
    setTextState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setTheme = useCallback((partial: Partial<ThemeConfig>) => {
    if (partial.colors) setColorsState((prev) => ({ ...prev, ...partial.colors! }));
    if (partial.darkColors) setDarkColorsState((prev) => ({ ...prev, ...partial.darkColors! }));
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
    root.style.setProperty("--theme-primary", darkMode ? darkColors.primary : colors.primary);
    root.style.setProperty("--theme-secondary", darkMode ? darkColors.secondary : colors.secondary);
  }, [colors, darkMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      enabled: true,
      colors,
      darkColors,
      darkMode,
      text,
      setColors,
      setDarkColors,
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
      darkColors: defaultConfig.darkColors as ThemeColors,
      darkMode: defaultConfig.darkMode,
      text: defaultConfig.text as ThemeTextClasses,
      setColors: () => {},
      setDarkMode: () => {},
      setText: () => {},
      setTheme: () => {},
      setDarkColors: () => {},
    };
  }
  return ctx;
}

export { defaultConfig as themeConfig };
