import { glass } from "../theme/glass";
import type { UnicornialConfig } from "../theme/types";

/**
 * Default configuration of the library. `theme` is everything visual and `env` holds
 * runtime values. Pass a partial of it to <ThemeProvider config={...}> to override.
 *
 * Keep the light colors in sync with the `:root` defaults in index.css.
 */
export const unicornialConfig = {
  theme: {
    colors: {
      primary: "#7642ef",
      secondary: "#f4f4f5",
      text: "#000000",
      background: "#ffffff",
      border: "#e4e4e7",
      header: {
        background: "#ffffff",
        border: "#e4e4e7",
      },
    },
    dark: {
      enabled: false,
      colors: {
        primary: "#aa3bff",
        secondary: "#f4f4f5",
        text: "#ffffff",
        background: "#0b0912",
        border: "#2a2535",
        header: {
          background: "#0b0912",
          border: "#2a2535",
        },
      },
    },
    text: {
      title: "text-3xl font-bold",
      subtitle: "text-xl font-semibold",
      paragraph: "text-base font-normal",
    },
    notifications: {
      position: "top-right",
    },
    variants: { glass },
  },
  env: {
    /** Base url used by the http wrappers. */
    apiUrl: "",
  },
} satisfies UnicornialConfig;
