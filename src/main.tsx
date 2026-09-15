import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header";
import "./index.css";
import Background from "./components/Background";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";
import logo from "./assets/logo.png";
import darkLogo from "./assets/darklogo.png";
import { Surface } from "./components/Surface";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{...themeConfig, darkMode: false}}>
      <Background variant="dots-grid" size={40} color="#00000066" className="min-h-screen" mask="fade-in">
        <Header variant="default" behaviour="default">
          <Header.Logo src={logo} darkSrc={darkLogo} />
        </Header>
        <div className="w-full px-12 pt-8 flex items-center justify-center gap-4 grow">
          <Surface className="w-md h-full">
            hola
          </Surface>
          <Surface className="w-full h-full">
            hola
          </Surface>
        </div>
      </Background>
    </ThemeProvider>
  </StrictMode>,
);
