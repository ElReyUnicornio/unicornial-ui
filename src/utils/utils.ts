//colors ------------------------------------------------------------------------------------------------

// Convert a hex color to rgba components.
export function hexToRgba(hex: string, alpha: number): number[] {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return [r, g, b, alpha];
}

export function rgbaToString(components: number[]) {
  return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${components[3]})`;
}

export function stringToRgba(str: string): number[] {
  const match = str.match(/rgba\((\d+), (\d+), (\d+), (\d+\.\d+)\)\)/);
  if (!match) {
    throw new Error("Invalid rgba string");
  }
  return match.slice(1).map(Number);
}

// rgb to hsl
export function rgbToHsl(components: number[]): number[] {
  let [r, g, b] = components;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

    if (delta !== 0) {
        // Saturación
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        // Tono
        switch (max) {
        case r:
            h = (g - b) / delta + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / delta + 2;
            break;
        case b:
            h = (r - g) / delta + 4;
            break;
        }
        h /= 6;
    }
    h = Math.round(h * 360),
    s = Math.round(s * 100),
    l = Math.round(l * 100)
    return [h, s, l];
}

export function hslToRgb(components: number[]): number[] {
  let [h, s, l] = components;

    s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    // Caso acromático (es un tono de gris)
    r = g = b = l; 
  } else {
    // Función auxiliar para calcular cada canal de color
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    // Calcular variables temporales q y p
    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;

    // Convertir el tono (h) a una fracción entre 0 y 1
    const hFrac: number = h / 360;

    // Calcular los tres canales independientes
    r = hue2rgb(p, q, hFrac + 1 / 3);
    g = hue2rgb(p, q, hFrac);
    b = hue2rgb(p, q, hFrac - 1 / 3);
  }

  
    r = Math.round(r * 255),
    g = Math.round(g * 255),
    b = Math.round(b * 255)
  return [r, g, b];
}

export function hslToString(components: number[]) {
  return `hsl(${components[0]}, ${components[1]}, ${components[2]})`;
}

export function stringToHsl(str: string): number[] {
  const match = str.match(/hsl\((\d+), (\d+), (\d+\.\d+)\)\)/);
  if (!match) {
    throw new Error("Invalid hsl string");
  }
  return match.slice(1).map(Number);
}

export function changeColorValue(hex: string, value: number): string {
  const rgba = hexToRgba(hex, 1);
  const hsl = rgbToHsl(rgba);
  const newHsl = [hsl[0], hsl[1], value];
  return hslToString(newHsl);
}
