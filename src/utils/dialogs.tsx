import type { ReactNode } from "react";
import { Modal } from "../components/Modal";
import { Drawer, type DrawerSide } from "../components/Drawer";
import { AlertDialog } from "../components/AlertDialog";
import type { AlertVariant } from "../components/Alert";
import { instantiate, type Instance } from "./portal";

export function showModal(
  title: ReactNode,
  child: ReactNode,
  onClose?: () => void,
  themeVariant?: string,
): Instance;
export function showModal(
  title: ReactNode,
  onClose: (() => void) | undefined,
  child: ReactNode,
  themeVariant?: string,
): Instance;
export function showModal(
  title: ReactNode,
  second: ReactNode | (() => void) | undefined,
  third?: ReactNode | (() => void),
  themeVariant?: string,
): Instance {
  // onClose is optional: showModal(title, child) or showModal(title, onClose, child)
  const [child, onClose] =
    typeof second === "function" || (second === undefined && third !== undefined)
      ? [third as ReactNode, second as (() => void) | undefined]
      : [second as ReactNode, third as (() => void) | undefined];
  return instantiate(({ close }) => (
    <Modal
      title={title}
      themeVariant={themeVariant}
      onClose={() => {
        close();
        onClose?.();
      }}
    >
      {child}
    </Modal>
  ));
}

export function showDrawer(
  title: ReactNode,
  child: ReactNode,
  onClose?: () => void,
  themeVariant?: string,
  side?: DrawerSide,
): Instance {
  return instantiate(({ close }) => (
    <Drawer
      title={title}
      side={side}
      themeVariant={themeVariant}
      onClose={() => {
        close();
        onClose?.();
      }}
    >
      {child}
    </Drawer>
  ));
}

/** Resolves to `true` when confirmed and `false` when rejected/dismissed. Never rejects. */
export interface AlertHandle extends Promise<boolean> {
  onConfirm: (callback: () => void) => AlertHandle;
  onReject: (callback: () => void) => AlertHandle;
  close: () => void;
}

export function showAlert(
  type: AlertVariant,
  message: ReactNode,
  themeVariant?: string,
): AlertHandle {
  let instance!: Instance;
  const result = new Promise<boolean>((resolve) => {
    const finish = (confirmed: boolean) => {
      instance.close();
      resolve(confirmed);
    };
    instance = instantiate(
      <AlertDialog
        variant={type}
        message={message}
        themeVariant={themeVariant}
        onConfirm={() => finish(true)}
        onReject={() => finish(false)}
      />,
    );
  });

  const handle: AlertHandle = Object.assign(result, {
    onConfirm: (callback: () => void) => {
      result.then((confirmed) => confirmed && callback());
      return handle;
    },
    onReject: (callback: () => void) => {
      result.then((confirmed) => !confirmed && callback());
      return handle;
    },
    close: () => instance.close(),
  });
  return handle;
}
