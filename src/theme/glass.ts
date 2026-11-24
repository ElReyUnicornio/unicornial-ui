import type { CSSProperties } from "react";
import type { ThemeVariant } from "./types";

// Building blocks of the "glass" look, so each component only states what is different. ------
//
// Light and dark share the same variant: the --glass-* variables (index.css) scale the light
// edges and glows and pick the shadow color, so in dark mode they become subtle.

/** Light edge or glow; `percent` is its strength in light mode. */
const white = (percent: number) =>
  `color-mix(in srgb, white calc(${percent}% * var(--glass-strength)), transparent)`;
/** Translucent theme background; `percent` is its opacity in light mode (denser in dark mode). */
const fill = (percent: number) =>
  `color-mix(in srgb, var(--theme-background) min(100%, calc(${percent}% * var(--glass-fill-strength))), transparent)`;
/** Shadow tint (indigo in light mode, black in dark mode); `alpha` is its opacity in light mode. */
const indigo = (alpha: number) =>
  `color-mix(in srgb, var(--glass-shadow) calc(${Math.round(alpha * 100)}% * var(--glass-shadow-strength)), transparent)`;

/** Blur + saturation of what is behind the element (prefixed too, for older Safari). */
const blur = (px: number): CSSProperties => {
  const value = `blur(${px}px) saturate(180%)`;
  return { backdropFilter: value, WebkitBackdropFilter: value };
};

const SHEEN = `linear-gradient(145deg, ${white(40)}, transparent 60%)`;

/** Light rim, inner glow, inner shade at the bottom and a soft outer shadow. */
const shadow = (size: number, glow: number, shade: number, outer: string) =>
  [
    `inset 0 0 0 1px ${white(75)}`,
    `inset 0 1px 0 ${white(80)}`,
    `inset 0 0 ${size}px 0 ${white(glow)}`,
    `inset 0 -12px ${size}px -12px ${indigo(shade)}`,
    outer,
  ].join(", ");

const PANEL_SHADOW = shadow(22, 45, 0.2, `0 10px 30px -8px ${indigo(0.28)}`);
const CARD_SHADOW = shadow(22, 40, 0.2, `0 4px 14px -4px ${indigo(0.25)}`);
const NOTICE_SHADOW = shadow(16, 35, 0.12, `0 4px 14px -4px ${indigo(0.25)}`);

/** Frosted panel: translucent fill, sheen, blur, light border. */
const panel = (blurPx: number, boxShadow: string, radius: string): CSSProperties => ({
  backgroundColor: fill(32),
  backgroundImage: SHEEN,
  ...blur(blurPx),
  borderColor: white(70),
  boxShadow,
  borderRadius: radius,
});

/** Translucent field with a light border (inputs, radio, image area). */
const field = (blurPx: number, fillPercent: number): CSSProperties => ({
  backgroundColor: fill(fillPercent),
  ...blur(blurPx),
});

const rim = { boxShadow: `inset 0 0 0 1px ${white(70)}` } satisfies CSSProperties;
const thumbShadow = { boxShadow: `0 2px 8px ${indigo(0.35)}` } satisfies CSSProperties;

const dimmedBackdrop = {
  backgroundColor: indigo(0.12),
  ...blur(8),
} satisfies CSSProperties;

// Dialogs sit over a dimmed backdrop, so they get their own (lighter in dark mode) opacity.
const dialogContainer = {
  backgroundColor: "color-mix(in srgb, var(--theme-background) var(--glass-dialog-fill), transparent)",
  ...blur(24),
} satisfies CSSProperties;

/** Same look for Modal, AlertDialog and Drawer. */
const dialog = {
  backdrop: { style: dimmedBackdrop },
  container: { style: dialogContainer },
};

// The sidebar only has a border on its right side.
const { borderColor: _all, ...sidebarPanel } = panel(18, PANEL_SHADOW, "0 1.5rem 1.5rem 0");

const notice = {
  root: {
    style: { ...blur(12), borderRadius: "1rem", boxShadow: NOTICE_SHADOW },
  },
};

export const glass: ThemeVariant = {
  surface: { root: { style: panel(18, PANEL_SHADOW, "1.5rem") } },
  button: {
    root: { style: { borderRadius: "0.875rem" } },
    // A translucent chip that follows the text color, instead of a solid light button.
    secondary: {
      style: {
        backgroundColor: "color-mix(in srgb, var(--theme-text) 7%, transparent)",
        color: "var(--theme-text)",
      },
    },
  },
  input: {
    label: { style: { color: "var(--theme-text)", fontWeight: 600 } },
    field: {
      style: {
        ...field(10, 40),
        borderColor: white(70),
        borderRadius: "0.875rem",
        color: "var(--theme-text)",
        boxShadow: [
          `inset 0 2px 8px ${indigo(0.18)}`,
          `inset 0 0 0 1px ${white(70)}`,
          `inset 0 -1px 0 ${white(60)}`,
        ].join(", "),
      },
    },
  },
  header: {
    root: {
      style: {
        ...panel(18, PANEL_SHADOW, "9999px"),
        top: "0.75rem",
        left: "1rem",
        width: "calc(100% - 2rem)",
        borderBottomColor: white(70),
        borderWidth: 1,
        borderStyle: "solid",
      },
    },
  },
  footer: {
    root: { style: { ...panel(18, PANEL_SHADOW, "1.75rem"), borderWidth: 1, borderStyle: "solid" } },
  },
  wireframe: { root: { style: { ...field(14, 30), borderRadius: "1.25rem" } } },
  sidebar: {
    root: { style: { ...sidebarPanel, borderRightColor: white(70) } },
    button: { style: { borderRadius: "9999px" } },
  },
  modal: dialog,
  alertDialog: dialog,
  drawer: dialog,
  accordion: {
    root: { style: panel(14, CARD_SHADOW, "1.25rem") },
    header: { style: { fontWeight: 600 } },
  },
  alert: {
    root: {
      style: { ...notice.root.style, backgroundColor: "color-mix(in srgb, var(--alert-bg) 55%, transparent)" },
    },
  },
  toast: {
    root: {
      style: { ...notice.root.style, backgroundColor: "color-mix(in srgb, var(--alert-bg) 60%, transparent)" },
    },
  },
  tooltip: {
    root: { style: { ...panel(14, CARD_SHADOW, "0.75rem"), backgroundColor: fill(55) } },
    arrow: { style: { backgroundColor: fill(55) } },
  },
  tab: { root: { style: { borderRadius: "0.75rem 0.75rem 0 0" } } },
  dropdown: { root: { style: panel(18, PANEL_SHADOW, "1.25rem") } },
  switch: { track: { style: rim }, thumb: { style: thumbShadow } },
  spinner: {
    button: {
      style: {
        backgroundColor: "color-mix(in srgb, var(--theme-primary) 18%, transparent)",
        borderRadius: "9999px",
      },
    },
  },
  slider: { track: { style: rim }, thumb: { style: thumbShadow } },
  radio: { control: { style: field(8, 40) } },
  progressBar: {
    track: { style: { ...field(8, 40), ...rim } },
    bar: {
      style: {
        backgroundImage: "linear-gradient(90deg, var(--theme-primary), var(--theme-primary-gradient))",
        boxShadow: "0 0 12px color-mix(in srgb, var(--theme-primary) 50%, transparent)",
      },
    },
  },
  imageInput: {
    area: {
      style: { ...field(10, 30), borderColor: white(70), borderRadius: "1rem" },
    },
  },
};
