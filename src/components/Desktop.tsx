import type { ReactNode } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

/** Renders its children only when the viewport is not in portrait orientation. */
export function DesktopOnly({ children }: { children: ReactNode }) {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  return isPortrait ? null : <>{children}</>;
}
