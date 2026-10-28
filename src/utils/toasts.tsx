import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Toast, type ToastColor } from "../components/Toast";
import { useTheme } from "../theme/ThemeProvider";
import type { NotificationPosition } from "../theme/types";

interface ToastItem {
  id: number;
  message: ReactNode;
  color: ToastColor;
  onClick?: () => void;
  themeVariant?: string;
}

export interface ToastHandle {
  id: number;
  close: () => void;
}

const DEFAULT_DURATION = 4000;

let nextId = 1;
let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  toasts = [...toasts];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function closeToast(id: number) {
  if (!toasts.some((toast) => toast.id === id)) return;
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

/**
 * Shows a toast in the notifications layer of the portal.
 * `duration` is in milliseconds; pass 0 to keep it until it is closed.
 */
export function showToast(
  message: ReactNode,
  color: ToastColor = "info",
  onClick?: () => void,
  duration: number = DEFAULT_DURATION,
  themeVariant?: string,
): ToastHandle {
  const id = nextId++;
  const close = () => closeToast(id);
  toasts = [...toasts, { id, message, color, onClick, themeVariant }];
  emit();
  if (duration > 0) setTimeout(close, duration);
  return { id, close };
}

const positionStyles: Record<NotificationPosition, CSSProperties> = {
  "top-left": { justifyContent: "flex-start", alignItems: "flex-start" },
  top: { justifyContent: "flex-start", alignItems: "center" },
  "top-right": { justifyContent: "flex-start", alignItems: "flex-end" },
  "bottom-left": { justifyContent: "flex-end", alignItems: "flex-start" },
  bottom: { justifyContent: "flex-end", alignItems: "center" },
  "bottom-right": { justifyContent: "flex-end", alignItems: "flex-end" },
};

export function ToastContainer() {
  const current = useSyncExternalStore(subscribe, () => toasts);
  const { notifications } = useTheme();

  return (
    <div
      className="absolute inset-0 flex flex-col gap-2 p-4"
      style={{ pointerEvents: "none", ...positionStyles[notifications.position] }}
    >
      {current.map(({ id, message, color, onClick, themeVariant }) => (
        <div key={id} style={{ pointerEvents: "auto" }}>
          <Toast
            color={color}
            themeVariant={themeVariant}
            message={message}
            onClick={onClick}
            onClose={() => closeToast(id)}
          />
        </div>
      ))}
    </div>
  );
}
