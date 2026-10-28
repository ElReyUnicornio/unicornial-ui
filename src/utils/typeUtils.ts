export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

// Deep merge two objects, handling nested objects and arrays.
// If a property is undefined in the overrides, it is not merged.
export const deepMerge = <T extends object>(base: T, overrides: DeepPartial<T>): T => {
  const result: any = { ...base };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const value = (overrides as any)[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(base[key] as any, value as any);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
};
