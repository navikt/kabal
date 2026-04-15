import { type Path, PathApi } from 'platejs';

/** Returns true if the caret is inside the element at the given path. */
export const containsCaret = (elementPath: Path, caretPath: Path | null): boolean =>
  caretPath !== null && (PathApi.equals(elementPath, caretPath) || PathApi.isAncestor(elementPath, caretPath));
