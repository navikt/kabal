export const isNotNull = <T>(v: T | null): v is T => v !== null;
export const isNotUndefined = <T>(v: T | undefined): v is T => v !== undefined;
export const isNotNullOrUndefined = <T>(v: T | null | undefined): v is T => v !== null && v !== undefined;
