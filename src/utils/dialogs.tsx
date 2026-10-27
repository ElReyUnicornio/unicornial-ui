import type { ReactNode } from "react";
import { Modal } from "../components/Modal";
import { AlertDialog } from "../components/AlertDialog";
import type { AlertVariant } from "../components/Alert";
import { instantiate, type Instance } from "./portal";

export function showModal(title: ReactNode, onClose: (() => void) | undefined, child: ReactNode): Instance {
  return instantiate(({ close }) => (
    <Modal
      title={title}
      onClose={() => {
        close();
        onClose?.();
      }}
    >
      {child}
    </Modal>
  ));
}

/** Resolves to `true` when confirmed and `false` when rejected/dismissed. Never rejects. */
export interface AlertHandle extends Promise<boolean> {
  onConfirm: (callback: () => void) => AlertHandle;
  onReject: (callback: () => void) => AlertHandle;
  close: () => void;
}

export function showAlert(type: AlertVariant, message: ReactNode): AlertHandle {
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
