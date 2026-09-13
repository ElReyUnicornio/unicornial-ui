import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/Button";
import Header from "./components/Header";
import "./index.css";
import Background from "./components/Background";
import Separator from "./components/Separator";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";
import { Input } from "./components/Input";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{...themeConfig}}>
      <Background variant="dots-grid" color="#00000055" className="min-h-screen">
        <Header className="min-h-20">
          <Header.Logo />
        </Header>
      </Background>
    </ThemeProvider>
  </StrictMode>,
);
