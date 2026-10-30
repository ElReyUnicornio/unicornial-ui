import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { Surface } from "./Surface";
import { CloseButton, useEscape } from "./Modal";
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

const hiddenTransform: Record<DrawerSide, string> = {
  left: "translateX(-100%)",
  right: "translateX(100%)",
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
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
  const backdrop = themed("backdrop");
  const container = themed("container");
  const header = themed("header");
  const titleStyle = themed("title");
  const body = themed("body");
  const [shown, setShown] = useState(false);
  useEscape(onClose);

  // Mount hidden, then slide in on the next frame.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cx("fixed inset-0 flex", backdropClasses[side], backdrop.className)}
      style={{ backgroundColor: "#00000066", ...backdrop.style }}
      onClick={onClose}
    >
      <Surface
        role="dialog"
        aria-modal="true"
        themeVariant={themeVariant}
        {...props}
        className={cx(
          "flex flex-col p-0 transition-transform duration-300 ease-out",
          panelClasses[side],
          container.className,
          className,
        )}
        style={{
          transform: shown ? "none" : hiddenTransform[side],
          ...container.style,
          ...style,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={cx(
            "flex items-center justify-between gap-2 px-4 py-2 border-b border-inherit shrink-0",
            header.className,
          )}
          style={header.style}
        >
          <h2 className={cx(text.subtitle, titleStyle.className)} style={titleStyle.style}>
            {title}
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <div
          className={cx("p-4 flex-1 overflow-auto", text.paragraph, body.className)}
          style={body.style}
        >
          {children}
        </div>
      </Surface>
    </div>
  );
}

export default Drawer;
