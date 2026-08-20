import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/Button";
import Header from "./components/Header";
import "./index.css";
import Background from "./components/Background";
import Separator from "./components/Separator";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{...themeConfig, darkMode: true}}>
      <div>
      <Header behaviour="blur">
        <Header.Logo src="/logo.svg" alt="Logo" />
        <nav className="flex items-center gap-2">
          <Header.NavButton href="/">Inicio</Header.NavButton>
          <Header.NavButton href="/docs">Docs</Header.NavButton>
          <Header.NavButton href="/contacto">Contacto</Header.NavButton>
        </nav>
      </Header>
      <Background color="rgba(0,0,0,0.2)" variant="dots-grid" className="flex flex-col items-center min-h-screen">
      <div className="pt-44 flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-heading font-bold text-text-h">
        Unicornial UI
      </h1>
      <p className="text-text max-w-md text-center">
        A Tailwind CSS component library. Build beautiful interfaces fast.
      </p>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <Button variant="primary" size="lg">
          Primary
        </Button>
        <Button variant="secondary" size="lg">
          Secondary
        </Button>
        <Button variant="outline" size="lg">
          Outline
        </Button>
        <Button variant="ghost" size="lg">
          Ghost
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </div>
      </div>
      <Separator className="max-w-11/12" thickness={2} spacing={75}/>
    </Background>
    </div>
    </ThemeProvider>
  </StrictMode>,
);
