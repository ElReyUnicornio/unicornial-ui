import type { ComponentName, StyleDef } from "./types";
import { useTheme } from "./ThemeProvider";

const EMPTY: StyleDef = {};

/**
 * Returns a getter for the styles a theme variant defines for one component:
 * `const v = useVariant("input", themeVariant); v("label").style`.
 * Precedence in components: base styles < variant styles < props.
 */
export function useVariant(component: ComponentName, themeVariant?: string) {
  const { variants } = useTheme();
  const definition = themeVariant ? variants[themeVariant]?.[component] : undefined;
  return (part: string = "root"): StyleDef => definition?.[part] ?? EMPTY;
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
