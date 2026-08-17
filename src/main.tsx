import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/Button";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 p-8">
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
  </StrictMode>,
);
