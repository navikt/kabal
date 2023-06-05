import React from 'react';
import { Editor, Transforms } from 'slate';
import { isPlaceholderActive } from '../../functions/insert-placeholder';
import { getCurrentCell } from '../../functions/table/helpers';
import { ContentTypeEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { PlaceholderElementType } from '../../types/editor-types';

export const selectAll = (event: React.KeyboardEvent, editor: Editor) => {
  if (editor.selection === null) {
    event.preventDefault();

    return;
  }

  if (isPlaceholderActive(editor)) {
    event.preventDefault();

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
        offset: node.children.at(-1)?.text.length ?? 0,
      },
    });

    return;
  }

  const currentCell = getCurrentCell(editor);

  if (currentCell !== undefined) {
    event.preventDefault();

    const [, path] = currentCell;
    Transforms.select(editor, path);
  }
};
