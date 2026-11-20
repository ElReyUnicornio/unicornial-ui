import type { ComponentName, ComponentParts, StyleDef } from "./types";
import { useTheme } from "./ThemeProvider";

const EMPTY: StyleDef = {};

/**
 * Returns a getter for the styles a theme variant defines for one component:
 * `const v = useVariant("input", themeVariant); v("label").style`.
 * The part names are checked against `ComponentParts`.
 * Precedence in components: base styles < variant styles < props.
 */
export function useVariant<C extends ComponentName>(component: C, themeVariant?: string) {
  const { variants } = useTheme();
  const definition = themeVariant
    ? (variants[themeVariant]?.[component] as Partial<Record<string, StyleDef>> | undefined)
    : undefined;
  return (part: ComponentParts[C]): StyleDef => definition?.[part] ?? EMPTY;
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
