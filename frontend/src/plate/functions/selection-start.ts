import type { RichTextEditor, TableElement } from '@app/plate/types';
import { type TRange, findNode, isCollapsed } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { type BasePoint, Range } from 'slate';

export const getSelectionStart = (editor: RichTextEditor, selection: TRange): BasePoint | null => {
  const table = findNode<TableElement>(editor, { match: { type: ELEMENT_TABLE } });

  if (table !== undefined) {
    return { path: table[1], offset: 0 };
  }

  return isCollapsed(selection) ? null : Range.start(selection);
};
