import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Background from "./components/Background";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";
import { Surface } from "./components/Surface";
import { UnicornialInput } from "./components/UnicornialInput";
import Validate from "./utils/validation";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{ ...themeConfig, darkMode: false }}>
      <Background
        variant="grid"
        size={50}
        color="#00000022"
        className="h-screen flex flex-col items-center justify-center"
        mask="fade-in"
      >
        <Surface className="w-96">
          <UnicornialInput label="Username" validator={Validate.email()} />
          <UnicornialInput label="Password" validator={Validate.min(6).onlyNumbers()} />
        </Surface>
      </Background>
    </ThemeProvider>
  </StrictMode>,
);
