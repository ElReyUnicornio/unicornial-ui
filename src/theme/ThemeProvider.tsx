import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import defaultConfig from "./theme.config.json";
import { PortalHost } from "../utils/portal";
import type {
  ThemeConfig,
  ThemeContextValue,
  ThemeColors,
  ThemeTextClasses,
  ThemeNotifications,
  ThemeProviderProps,
} from "./types";
import { deepMerge } from "../utils/typeUtils";

const PORTAL_ID = "unicornial-portal";

const ThemeContext =createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  const mergedInitial = useMemo(
    () => deepMerge(defaultConfig as ThemeConfig, config ?? {}),
    [config],
  );

  const [colors, setColorsState] = useState<ThemeColors>(mergedInitial.colors);
  const [darkColors, setDarkColorsState] = useState<ThemeColors>(mergedInitial.darkColors);

  const [darkMode, setDarkModeState] = useState<boolean>(mergedInitial.darkMode);
  const [text, setTextState] = useState<ThemeTextClasses>(mergedInitial.text);

  const [notifications, setNotificationsState] = useState<ThemeNotifications>(
    mergedInitial.notifications,
  );

  const setNotifications = useCallback((partial: Partial<ThemeNotifications>) => {
    setNotificationsState((prev) => ({ ...prev, ...partial }));
  }, []);

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
    if (partial.notifications) {
      setNotificationsState((prev) => ({ ...prev, ...partial.notifications! }));
    }
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
  }, [colors, darkMode, darkColors]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      enabled: true,
      colors,
      darkColors,
      darkMode,
      text,
      notifications,
      setNotifications,
      setColors,
      setDarkColors,
      setDarkMode,
      setText,
      setTheme,
    }),
    [colors, darkMode, darkColors, text, notifications, setNotifications, setColors, setDarkMode, setDarkColors, setText, setTheme],
  );

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.id = PORTAL_ID;
    Object.assign(container.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      pointerEvents: "none",
    });
    document.body.appendChild(container);
    setPortalContainer(container);
    return () => {
      container.remove();
      setPortalContainer(null);
    };
  }, []);

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {portalContainer && createPortal(<PortalHost />, portalContainer)}
    </ThemeContext.Provider>
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
      notifications: defaultConfig.notifications as ThemeNotifications,
      setNotifications: () => {},
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
