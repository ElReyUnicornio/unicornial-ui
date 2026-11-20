import type { HTMLAttributes, ReactNode } from "react";
import { Surface } from "./Surface";
import { Backdrop, OverlayHeader, stopPropagation } from "./Overlay";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

export type DrawerSide = "left" | "right" | "top" | "bottom";

interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  side?: DrawerSide;
  onClose?: () => void;
  /** Name of a variant defined in the theme config (variants[name].drawer.{backdrop,container,header,title,body}). */
  themeVariant?: string;
  children?: ReactNode;
}

const backdropClasses: Record<DrawerSide, string> = {
  left: "justify-start",
  right: "justify-end",
  top: "items-start",
  bottom: "items-end",
};

const panelClasses: Record<DrawerSide, string> = {
  left: "h-full w-full max-w-sm rounded-none",
  right: "h-full w-full max-w-sm rounded-none",
  top: "w-full max-h-[80%] rounded-none",
  bottom: "w-full max-h-[80%] rounded-none",
};

// Slide in from the side on mount (@starting-style), no state or effect needed.
const startingClasses: Record<DrawerSide, string> = {
  left: "starting:-translate-x-full",
  right: "starting:translate-x-full",
  top: "starting:-translate-y-full",
  bottom: "starting:translate-y-full",
};

export function Drawer({
  title,
  side = "right",
  onClose,
  themeVariant,
  className = "",
  style,
  children,
  ...props
}: DrawerProps) {
  const { text } = useTheme();
  const themed = useVariant("drawer", themeVariant);
  const container = themed("container");
  const body = themed("body");

  return (
    <Backdrop onDismiss={onClose} className={cx("flex", backdropClasses[side])} themed={themed("backdrop")}>
      <Surface
        role="dialog"
        aria-modal="true"
        themeVariant={themeVariant}
        {...props}
        className={cx(
          "flex flex-col p-0 shadow-float transition-transform duration-300 ease-out",
          panelClasses[side],
          startingClasses[side],
          container.className,
          className,
        )}
        style={{ ...container.style, ...style }}
        onClick={stopPropagation}
      >
        <OverlayHeader
          title={title}
          onClose={onClose}
          className="shrink-0"
          themedHeader={themed("header")}
          themedTitle={themed("title")}
          titleClass={text.subtitle}
        />
        <div
          className={cx("p-4 flex-1 overflow-auto", text.paragraph, body.className)}
          style={body.style}
        >
          {children}
        </div>
      </Surface>
    </Backdrop>
  );
}

export default Drawer;
