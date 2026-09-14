import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header";
import "./index.css";
import Background from "./components/Background";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";
import logo from "./assets/logo.png";
import darkLogo from "./assets/darklogo.png";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{...themeConfig, darkMode: false}}>
      <Background variant="grid-45" color="#00000055" className="min-h-screen">
        <Header variant="default" behaviour="default">
          <Header.Logo src={logo} darkSrc={darkLogo} />
        </Header>
      </Background>
    </ThemeProvider>
  </StrictMode>,
);
