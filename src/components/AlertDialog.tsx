import type { ReactNode } from "react";
import { Surface } from "./Surface";
import { Button } from "./Button";
import { AlertIcon, alertColors, type AlertVariant } from "./Alert";
import { CloseButton, useEscape } from "./Modal";
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
  const backdrop = themed("backdrop");
  const container = themed("container");
  const icon = themed("icon");
  const messageStyle = themed("message");
  useEscape(onReject);

  return (
    <div
      className={cx("fixed inset-0 flex items-center justify-center p-4", backdrop.className)}
      style={{ backgroundColor: "#00000066", ...backdrop.style }}
      onClick={onReject}
    >
      <Surface
        role="alertdialog"
        aria-modal="true"
        themeVariant={themeVariant}
        className={cx(
          "relative w-full max-w-sm flex flex-col items-center gap-4 p-6 text-center shadow-float",
          container.className,
        )}
        style={container.style}
        onClick={(event) => event.stopPropagation()}
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
        <p className={cx(text.paragraph, messageStyle.className)} style={messageStyle.style}>
          {message}
        </p>
        <div className="flex gap-2">
          {buttons.reject && (
            <Button type="button" variant="outline" themeVariant={themeVariant} onClick={onReject}>
              {buttons.reject}
            </Button>
          )}
          <Button type="button" themeVariant={themeVariant} onClick={onConfirm}>
            {buttons.confirm}
          </Button>
        </div>
      </Surface>
    </div>
  );
}

export default AlertDialog;
