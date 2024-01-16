import { Draft } from '@reduxjs/toolkit';

type MaybeDrafted<T> = T | Draft<T>;
type Recipe<T> = (data: MaybeDrafted<T>) => void | MaybeDrafted<T>;
export type UpdateFn<T> = (recipe: Recipe<T>) => PatchCollection;

interface Patch {
  op: 'replace' | 'remove' | 'add';
  path: (string | number)[];
  value?: unknown;
}

interface PatchCollection {
  /**
   * An `immer` Patch describing the cache update.
   */
  patches: Patch[];
  /**
   * An `immer` Patch to revert the cache update.
   */
  inversePatches: Patch[];
  /**
   * A function that will undo the cache update.
   */
  undo: () => void;
}
