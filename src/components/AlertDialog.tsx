import { useId, useRef, type ReactNode } from "react";
import { Surface } from "./Surface";
import { Button } from "./Button";
import { AlertIcon, alertColors, type AlertVariant } from "./Alert";
import { Backdrop, CloseButton, stopPropagation, useFocusTrap } from "./Overlay";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

interface AlertDialogProps {
  variant?: AlertVariant;
  message: ReactNode;
  onConfirm?: () => void;
  onReject?: () => void;
  /** Name of a variant defined in the theme config (variants[name].alertDialog.{backdrop,container,icon,message}). */
  themeVariant?: string;
}

const dialogButtons: Record<AlertVariant, { confirm: string; reject?: string }> = {
  info: { confirm: "Accept" },
  success: { confirm: "Accept" },
  warning: { confirm: "Continue", reject: "Cancel" },
  error: { confirm: "Retry", reject: "Close" },
};

export function AlertDialog({
  variant = "info",
  message,
  onConfirm,
  onReject,
  themeVariant,
}: AlertDialogProps) {
  const { text } = useTheme();
  const colors = alertColors[variant];
  const buttons = dialogButtons[variant];
  const themed = useVariant("alertDialog", themeVariant);
  const container = themed("container");
  const icon = themed("icon");
  const messageStyle = themed("message");
  const surfaceRef = useRef<HTMLDivElement>(null);
  const messageId = useId();
  useFocusTrap(surfaceRef);

  return (
    <Backdrop
      onDismiss={onReject}
      className="flex items-center justify-center p-4"
      themed={themed("backdrop")}
    >
      <Surface
        ref={surfaceRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={messageId}
        tabIndex={-1}
        themeVariant={themeVariant}
        className={cx(
          "relative w-full max-w-sm flex flex-col items-center gap-4 p-6 text-center shadow-float",
          container.className,
        )}
        style={container.style}
        onClick={stopPropagation}
      >
        <div className="absolute top-2 right-2">
          <CloseButton onClick={onReject} />
        </div>
        <div
          className={cx("flex items-center justify-center w-14 h-14 rounded-full", icon.className)}
          style={{ color: colors.color, backgroundColor: colors.background, ...icon.style }}
        >
          <AlertIcon variant={variant} size={32} />
        </div>
        <p id={messageId} className={cx(text.paragraph, messageStyle.className)} style={messageStyle.style}>
          {message}
        </p>
        <div className="flex gap-2">
          {buttons.reject && (
            <Button type="button" variant="outline" themeVariant={themeVariant} onClick={onReject} data-autofocus>
              {buttons.reject}
            </Button>
          )}
          <Button type="button" themeVariant={themeVariant} onClick={onConfirm} data-autofocus={!buttons.reject || undefined}>
            {buttons.confirm}
          </Button>
        </div>
      </Surface>
    </Backdrop>
  );
}

export default AlertDialog;
