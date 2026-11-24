import { useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { Surface } from "./Surface";
import { Backdrop, OverlayHeader, stopPropagation, useFocusTrap } from "./Overlay";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  onClose?: () => void;
  /** Name of a variant defined in the theme config (variants[name].modal.{backdrop,container,header,title,body}). */
  themeVariant?: string;
  children?: ReactNode;
}

export function Modal({
  title,
  onClose,
  themeVariant,
  className = "",
  style,
  children,
  ...props
}: ModalProps) {
  const { text } = useTheme();
  const themed = useVariant("modal", themeVariant);
  const container = themed("container");
  const body = themed("body");
  const surfaceRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(surfaceRef);

  return (
    <Backdrop
      onDismiss={onClose}
      className="flex items-center justify-center p-4"
      themed={themed("backdrop")}
    >
      <Surface
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        themeVariant={themeVariant}
        {...props}
        className={cx("w-full max-w-md p-0 shadow-float", container.className, className)}
        style={{ ...container.style, ...style }}
        onClick={stopPropagation}
      >
        <OverlayHeader
          title={title}
          titleId={titleId}
          onClose={onClose}
          themedHeader={themed("header")}
          themedTitle={themed("title")}
          titleClass={text.subtitle}
        />
        <div className={cx("p-4", text.paragraph, body.className)} style={body.style}>
          {children}
        </div>
      </Surface>
    </Backdrop>
  );
}

export default Modal;
