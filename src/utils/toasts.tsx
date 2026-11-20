import type { CSSProperties, ReactNode } from "react";
import { Toast, type ToastColor } from "../components/Toast";
import { useTheme } from "../theme/ThemeProvider";
import type { NotificationPosition } from "../theme/types";
import { createStore, useStore } from "./store";

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
const store = createStore<ToastItem[]>([]);

function closeToast(id: number) {
  const toasts = store.get();
  if (toasts.some((toast) => toast.id === id)) store.set(toasts.filter((toast) => toast.id !== id));
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
  store.set([...store.get(), { id, message, color, onClick, themeVariant }]);
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
  const current = useStore(store);
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
