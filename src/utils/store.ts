import { useSyncExternalStore } from "react";

export interface Store<T> {
  get: () => T;
  /** Replaces the state; always pass a new reference so subscribers re-render. */
  set: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
}

/** Minimal external store usable from anywhere (event handlers, utils, outside React). */
export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => state,
    set(next) {
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** Re-renders the component when the store changes. */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get);
}
