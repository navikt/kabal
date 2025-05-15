/** Checks if the given object has the given property. */
export const hasOwn = <T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> =>
  Object.hasOwn(obj, key);

export const isObject = (data: unknown): data is object => typeof data === 'object' && data !== null;
