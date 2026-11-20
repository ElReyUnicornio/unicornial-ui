/** Limits `value` to the `[min, max]` range (if `max < min`, `min` wins). */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

/** Number of decimal places of `n` (e.g. 0.25 -> 2). */
export const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

/** Rounds to `digits` decimal places and returns a number (no float noise like 0.30000000000000004). */
export const round = (n: number, digits = 0) => Number(n.toFixed(digits));
