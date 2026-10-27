import { useSyncExternalStore, type ReactNode } from "react";

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
let items: PortalItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  items = [...items];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

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
      if (!items.some((item) => item.id === id)) return;
      items = items.filter((item) => item.id !== id);
      emit();
    },
    update: (next) => {
      const item = items.find((item) => item.id === id);
      if (!item) return;
      item.content = next;
      emit();
    },
  };
  items = [...items, { id, content, api }];
  emit();
  return api;
}

export function PortalHost() {
  const current = useSyncExternalStore(subscribe, () => items);
  return (
    <>
      {current.map(({ id, content, api }) => (
        <div key={id} style={{ pointerEvents: "auto" }}>
          {typeof content === "function" ? content(api) : content}
        </div>
      ))}
    </>
  );
}
