import { Editor, Path, Transforms } from 'slate';
import { ContentTypeEnum, TableContentEnum, TableTypeEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { TableCellElementType } from '../../types/editor-types';
import { createCell, createRow } from './create-helpers';

export const canInsertTable = (editor: Editor) => {
  const [match] = Editor.nodes(editor, { match: isOfElementTypeFn(ContentTypeEnum.PARAGRAPH) });

  return match !== undefined;
};

export const insertTable = (editor: Editor) =>
  Editor.withoutNormalizing(editor, () => {
    if (editor.selection === null || !canInsertTable(editor)) {
      return;
    }

    const at = Path.parent(editor.selection.focus.path);

    Transforms.wrapNodes<TableCellElementType>(
      editor,
      { type: TableContentEnum.TD, colSpan: 1, children: [] },
      {
        match: isOfElementTypeFn(ContentTypeEnum.PARAGRAPH),
        split: false,
        mode: 'lowest',
        at,
      },
    );

    Transforms.wrapNodes(
      editor,
      { type: TableContentEnum.TR, children: [] },
      { match: isOfElementTypeFn(TableContentEnum.TD), at, split: false },
    );

    Transforms.wrapNodes(
      editor,
      { type: TableContentEnum.TBODY, children: [] },
      { match: isOfElementTypeFn(TableContentEnum.TR), at, split: false },
    );

    Transforms.wrapNodes(
      editor,
      {
        type: TableTypeEnum.TABLE,
        children: [{ type: TableContentEnum.TBODY, children: [] }],
      },
      { match: isOfElementTypeFn(TableContentEnum.TBODY), at, split: false },
    );

    Transforms.insertNodes(editor, createCell(), {
      match: isOfElementTypeFn(TableContentEnum.TD),
      at: [...at, 0, 0, 1],
    });

    Transforms.insertNodes(editor, [createRow(2), createRow(2)], {
      match: isOfElementTypeFn(TableContentEnum.TR),
      at: [...at, 0, 1],
    });
  });
