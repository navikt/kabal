export const isNotNull = <T>(v: T | null): v is T => typeof v !== null;
