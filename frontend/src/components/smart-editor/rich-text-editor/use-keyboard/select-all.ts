import React from 'react';
import { Editor, Path, Range, Transforms } from 'slate';

export const selectAll = (event: React.KeyboardEvent, editor: Editor) => {
  event.preventDefault();

  if (editor.selection === null) {
    return;
  }

  const previousVoidEntry = Editor.previous(editor, {
    at: editor.selection,
    voids: true,
    match: (n) => Editor.isVoid(editor, n),
  });

  const nextVoidEntry = Editor.next(editor, {
    at: editor.selection,
    voids: true,
    match: (n) => Editor.isVoid(editor, n),
  });

  const at: Range = {
    anchor:
      typeof previousVoidEntry === 'undefined'
        ? Editor.start(editor, [])
        : {
            path: Path.next(previousVoidEntry[1]),
            offset: 0,
          },
    focus:
      typeof nextVoidEntry === 'undefined'
        ? Editor.end(editor, [])
        : Editor.before(editor, nextVoidEntry[1]) ?? editor.selection.focus,
  };

  Transforms.select(editor, at);
};
