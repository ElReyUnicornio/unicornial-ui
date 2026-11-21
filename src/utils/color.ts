import { clamp, round } from "./number";

export type ColorSpace = "rgb" | "hsl" | "oklch";
export type ColorFormat = "hex" | ColorSpace;

export interface Channel {
  label: string;
  min: number;
  max: number;
  step: number;
}

export const channelsOf: Record<ColorSpace, Channel[]> = {
  rgb: [
    { label: "R", min: 0, max: 255, step: 1 },
    { label: "G", min: 0, max: 255, step: 1 },
    { label: "B", min: 0, max: 255, step: 1 },
  ],
  hsl: [
    { label: "H", min: 0, max: 360, step: 1 },
    { label: "S", min: 0, max: 100, step: 1 },
    { label: "L", min: 0, max: 100, step: 1 },
  ],
  oklch: [
    { label: "L", min: 0, max: 100, step: 0.1 },
    { label: "C", min: 0, max: 0.4, step: 0.001 },
    { label: "H", min: 0, max: 360, step: 0.1 },
  ],
};

type Triple = [number, number, number];


/** Accepts #rgb or #rrggbb (with or without #); returns lowercase #rrggbb or null. */
export function normalizeHex(input: string): string | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  return `#${hex.toLowerCase()}`;
}

export function hexToRgb(hex: string): Triple {
  const value = parseInt((normalizeHex(hex) ?? "#000000").slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function rgbToHex([r, g, b]: Triple): string {
  const part = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

export function rgbToHsl([r, g, b]: Triple): Triple {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l * 100];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === rn ? ((gn - bn) / d) % 6 : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
  return [(h * 60 + 360) % 360, s * 100, l * 100];
}

export function hslToRgb([h, s, l]: Triple): Triple {
  const [sn, ln] = [s / 100, l / 100];
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return (ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255;
  };
  return [f(0), f(8), f(4)];
}

/** Shifts the lightness of a hex color by `amount` percentage points; returns #rrggbb. */
function shiftLightness(hex: string, amount: number): string {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb([h, s, clamp(l + amount, 0, 100)]));
}

/** Lighter version of a hex color, meant as the light end of a gradient. */
export function getLighterGradientColor(hex: string, amount = 12): string {
  return shiftLightness(hex, amount);
}

/** Darker version of a hex color, meant as the dark end of a gradient. */
export function getDarkerGradientColor(hex: string, amount = 12): string {
  return shiftLightness(hex, -amount);
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** Returns [L (0-100), C, H (0-360)]. */
export function rgbToOklch([r, g, b]: Triple): Triple {
  const [lr, lg, lb] = [toLinear(r / 255), toLinear(g / 255), toLinear(b / 255)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  const H = C < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return [L * 100, C, H];
}

/** Out-of-gamut colors are clamped to sRGB. */
export function oklchToRgb([L, C, H]: Triple): Triple {
  const hr = (H * Math.PI) / 180;
  const [Ln, a, b] = [L / 100, C * Math.cos(hr), C * Math.sin(hr)];
  const l = (Ln + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (Ln - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (Ln - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin: Triple = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((c) => clamp(fromLinear(clamp(c, 0, 1)), 0, 1) * 255) as Triple;
}

export function hexToChannels(hex: string, space: ColorSpace): Triple {
  const rgb = hexToRgb(hex);
  if (space === "rgb") return rgb;
  return space === "hsl" ? rgbToHsl(rgb) : rgbToOklch(rgb);
}

export function channelsToHex(space: ColorSpace, channels: Triple): string {
  if (space === "rgb") return rgbToHex(channels);
  return rgbToHex(space === "hsl" ? hslToRgb(channels) : oklchToRgb(channels));
}

/** CSS color for the given channels, usable in gradients (the browser handles the gamut). */
export function channelsToCss(space: ColorSpace, [a, b, c]: Triple): string {
  if (space === "rgb") return `rgb(${round(a)}, ${round(b)}, ${round(c)})`;
  if (space === "hsl") return `hsl(${round(a)}, ${round(b)}%, ${round(c)}%)`;
  return `oklch(${round(a, 1)}% ${round(b, 3)} ${round(c, 1)})`;
}

/** Human-readable code for a hex color in the requested format. */
export function formatColor(hex: string, format: ColorFormat): string {
  return format === "hex" ? hex : channelsToCss(format, hexToChannels(hex, format));
}

/** WCAG relative luminance of a hex color. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => toLinear(c / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio (1 to 21) between two hex colors. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Darkens `hex` until white text on it reaches `min` contrast (4.5 is WCAG AA for body text). */
export function darkenForWhiteText(hex: string, min = 4.7): string {
  let result = normalizeHex(hex) ?? "#000000";
  for (let amount = 1; contrastRatio("#ffffff", result) < min && amount <= 100; amount++) {
    result = getDarkerGradientColor(hex, amount);
  }
  return result;
}
