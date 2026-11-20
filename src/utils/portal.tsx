import type { ReactNode } from "react";
import { ToastContainer } from "./toasts";
import { createStore, useStore } from "./store";

export interface InstanceApi {
  id: number;
  close: () => void;
  update: (content: InstanceContent) => void;
}

export type InstanceContent = ReactNode | ((api: InstanceApi) => ReactNode);

export interface Instance extends InstanceApi {}

interface PortalItem {
  id: number;
  content: InstanceContent;
  api: InstanceApi;
}

let nextId = 1;
const store = createStore<PortalItem[]>([]);

/**
 * Renders a component into the floating portal created by the ThemeProvider.
 * Can be called from anywhere (event handlers, utils, outside React).
 * The content may be a node or a function receiving `{ close, update, id }`.
 */
export function instantiate(content: InstanceContent): Instance {
  const id = nextId++;
  const api: InstanceApi = {
    id,
    close: () => {
      const items = store.get();
      if (items.some((item) => item.id === id)) store.set(items.filter((item) => item.id !== id));
    },
    update: (next) => {
      const items = store.get();
      if (items.some((item) => item.id === id)) {
        store.set(items.map((item) => (item.id === id ? { ...item, content: next } : item)));
      }
    },
  };
  store.set([...store.get(), { id, content, api }]);
  return api;
}

export function PortalHost() {
  const current = useStore(store);
  return (
    <>
      {current.map(({ id, content, api }) => (
        <div key={id} style={{ pointerEvents: "auto" }}>
          {typeof content === "function" ? content(api) : content}
        </div>
      ))}
      <ToastContainer />
    </>
  );
}
