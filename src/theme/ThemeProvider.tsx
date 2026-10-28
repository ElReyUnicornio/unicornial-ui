import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import defaultJson from "./theme.config.json";
import { PortalHost } from "../utils/portal";
import type {
  ThemeConfig,
  ThemeContextValue,
  ThemeColors,
  ThemeDark,
  ThemeText,
  ThemeNotifications,
  ThemeVariant,
  ThemeProviderProps,
} from "./types";
import { deepMerge, type DeepPartial } from "../utils/typeUtils";

const PORTAL_ID = "unicornial-portal";

const defaultConfig = defaultJson as unknown as ThemeConfig;

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(() =>
    deepMerge<ThemeConfig>(defaultConfig, config ?? {}),
  );

  const setTheme = useCallback((partial: DeepPartial<ThemeConfig>) => {
    setThemeState((prev) => deepMerge<ThemeConfig>(prev, partial));
  }, []);

  const setColors = useCallback(
    (colors: DeepPartial<ThemeColors>) => setTheme({ colors }),
    [setTheme],
  );
  const setDark = useCallback((dark: DeepPartial<ThemeDark>) => setTheme({ dark }), [setTheme]);
  const setDarkMode = useCallback(
    (enabled: boolean) => setTheme({ dark: { enabled } }),
    [setTheme],
  );
  const setText = useCallback((text: Partial<ThemeText>) => setTheme({ text }), [setTheme]);
  const setNotifications = useCallback(
    (notifications: Partial<ThemeNotifications>) => setTheme({ notifications }),
    [setTheme],
  );
  const setVariant = useCallback(
    (name: string, variant: ThemeVariant) => setTheme({ variants: { [name]: variant } }),
    [setTheme],
  );

  const currentColors = theme.dark.enabled ? theme.dark.colors : theme.colors;

  // Expose the active colors as CSS variables so variants can use them in plain CSS/Tailwind.
  useEffect(() => {
    const root = document.documentElement;
    const dark = theme.dark.enabled;
    root.classList.toggle("dark", dark);
    const vars: Record<string, string> = {
      "--theme-primary": currentColors.primary,
      "--theme-secondary": currentColors.secondary,
      "--theme-text": currentColors.text,
      "--theme-background": currentColors.background,
      "--theme-border": currentColors.border,
      "--theme-header-background": currentColors.header.background,
      "--theme-header-border": currentColors.header.border,
      // Slightly shifted surface and its two shadows, used by the neumorph variant.
      "--theme-soft": `color-mix(in srgb, ${currentColors.background} 92%, ${currentColors.text})`,
      "--theme-shadow-light": dark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.9)",
      "--theme-shadow-dark": dark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.18)",
    };
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  }, [currentColors, theme.dark.enabled]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...theme,
      enabled: true,
      currentColors,
      setColors,
      setDark,
      setDarkMode,
      setText,
      setNotifications,
      setVariant,
      setTheme,
    }),
    [
      theme,
      currentColors,
      setColors,
      setDark,
      setDarkMode,
      setText,
      setNotifications,
      setVariant,
      setTheme,
    ],
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

const noop = () => {};

// Used by components rendered outside a ThemeProvider: defaults, and `enabled: false`.
const fallbackTheme: ThemeContextValue = {
  ...defaultConfig,
  enabled: false,
  currentColors: defaultConfig.dark.enabled ? defaultConfig.dark.colors : defaultConfig.colors,
  setColors: noop,
  setDark: noop,
  setDarkMode: noop,
  setText: noop,
  setNotifications: noop,
  setVariant: noop,
  setTheme: noop,
};

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? fallbackTheme;
}

export { defaultConfig as themeConfig };
