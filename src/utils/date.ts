const pad = (n: number, size = 2) => String(n).padStart(size, "0");

/** Standard value format used by DatePicker: YYYY-MM-DD (local date, no time zone). */
export function toIso(year: number, month: number, day: number): string {
  return `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}`;
}

export function parseIso(iso: string | undefined): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  const date = new Date(year, month, day);
  // Rejects overflowing dates such as 2024-02-31.
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? { year, month, day }
    : null;
}

export function todayIso(): string {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Formats an ISO date for display. Tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D.
 * Any other text is kept as is.
 */
export function formatDate(iso: string, format: string, locale?: string): string {
  const parsed = parseIso(iso);
  if (!parsed) return "";
  const { year, month, day } = parsed;
  const date = new Date(year, month, day);
  const monthName = (style: "long" | "short") =>
    new Intl.DateTimeFormat(locale, { month: style }).format(date);
  return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D/g, (token) => {
    switch (token) {
      case "YYYY":
        return pad(year, 4);
      case "YY":
        return String(year).slice(-2);
      case "MMMM":
        return monthName("long");
      case "MMM":
        return monthName("short");
      case "MM":
        return pad(month + 1);
      case "M":
        return String(month + 1);
      case "DD":
        return pad(day);
      default:
        return String(day);
    }
  });
}
