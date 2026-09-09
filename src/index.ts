import "./index.css";

export { Button } from "./components/Button";
export { default as Header } from "./components/Header";
export { default as Background } from "./components/Background";
export { default as Separator } from "./components/Separator";
export { Input } from "./components/Input";
export { Validate, validators } from "./utils/validation";
export {
  ThemeProvider,
  useTheme,
  themeConfig,
  type ThemeConfig,
  type ThemeColors,
  type ThemeTextClasses,
  type ThemeContextValue,
} from "./theme/ThemeProvider";

