import React from 'react';
import { Editor, Path, Range, Transforms } from 'slate';
import { isPlaceholderActive } from '../../functions/insert-placeholder';
import { getCurrentCell } from '../../functions/table/helpers';
import { ContentTypeEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { PlaceholderElementType } from '../../types/editor-types';

export const selectAll = (event: React.KeyboardEvent, editor: Editor) => {
  event.preventDefault();

  if (editor.selection === null) {
    return;
  }

  if (isPlaceholderActive(editor)) {
    const [nodeEntry] = Editor.nodes(editor, {
      match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
      at: editor.selection,
    });

    if (nodeEntry === undefined) {
      return;
    }

    const [node, path] = nodeEntry;

    Transforms.select(editor, {
      anchor: {
        path: [...path, 0],
        offset: 0,
      },
      focus: {
        path: [...path, node.children.length - 1],
        offset: node.children[node.children.length - 1]?.text.length ?? 0,
      },
    });

    return;
  }

  const currentCell = getCurrentCell(editor);

  if (currentCell !== undefined) {
    const [, path] = currentCell;
    Transforms.select(editor, path);

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
        : Editor.before(editor, nextVoidEntry[1]) ?? editor.selection.focus, // This misses the last line, if empty.
  };

  Transforms.select(editor, at);
};
