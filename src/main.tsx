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
import { MobileOnly } from "./components/Mobile";
import { DesktopOnly } from "./components/Desktop";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{...themeConfig, darkMode: false}}>
      <Background variant="dots-grid" size={40} color="#00000066" className="h-screen" mask="fade-in">
        <Header variant="default" behaviour="default">
          <Header.Logo src={logo} darkSrc={darkLogo} />
        </Header>
        <div className="w-full px-12 py-8 flex gap-4 h-full flex-col items-center md:flex-row md:items-center">
          <MobileOnly>
            <Surface className="w-full h-full">
              hola
            </Surface>
          </MobileOnly>
          <DesktopOnly>
            <Surface className="w-96 h-full">
              adios
            </Surface>
            <Surface className="w-full h-full">
              adios
            </Surface>
          </DesktopOnly>
        </div>
      </Background>
    </ThemeProvider>
  </StrictMode>,
);
