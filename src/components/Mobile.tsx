import type { ReactNode } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

/** Renders its children only when the viewport is in portrait orientation. */
export function MobileOnly({ children }: { children: ReactNode }) {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  return isPortrait ? <>{children}</> : null;
}
