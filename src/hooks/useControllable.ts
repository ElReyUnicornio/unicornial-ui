import { useCallback, useState } from "react";

/**
 * State that can be controlled (`value` given) or uncontrolled (`defaultValue`).
 * `onChange` is called in both cases.
 */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  return [current, set] as const;
}
