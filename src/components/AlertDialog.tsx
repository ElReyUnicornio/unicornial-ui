import type { ReactNode } from "react";
import { Surface } from "./Surface";
import { Button } from "./Button";
import { AlertIcon, alertColors, type AlertVariant } from "./Alert";
import { CloseButton, useEscape } from "./Modal";

interface AlertDialogProps {
  variant?: AlertVariant;
  message: ReactNode;
  onConfirm?: () => void;
  onReject?: () => void;
}

const dialogButtons: Record<AlertVariant, { confirm: string; reject?: string }> = {
  info: { confirm: "Accept" },
  warning: { confirm: "Continue", reject: "Cancel" },
  error: { confirm: "Retry", reject: "Close" },
};

export function AlertDialog({ variant = "info", message, onConfirm, onReject }: AlertDialogProps) {
  const colors = alertColors[variant];
  const buttons = dialogButtons[variant];
  useEscape(onReject);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00000066" }}
      onClick={onReject}
    >
      <Surface
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-sm flex flex-col items-center gap-4 p-6 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute top-2 right-2">
          <CloseButton onClick={onReject} />
        </div>
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full"
          style={{ color: colors.color, backgroundColor: colors.background }}
        >
          <AlertIcon variant={variant} size={32} />
        </div>
        <p>{message}</p>
        <div className="flex gap-2">
          {buttons.reject && (
            <Button type="button" variant="outline" onClick={onReject}>
              {buttons.reject}
            </Button>
          )}
          <Button type="button" onClick={onConfirm}>
            {buttons.confirm}
          </Button>
        </div>
      </Surface>
    </div>
  );
}

export default AlertDialog;
