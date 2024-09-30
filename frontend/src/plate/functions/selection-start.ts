import type { RichTextEditor, TableElement } from '@app/plate/types';
import { type TRange, findNode, isCollapsed } from '@udecode/plate-common';
import { BaseTablePlugin } from '@udecode/plate-table';
import { type BasePoint, Range } from 'slate';

export const getSelectionStart = (editor: RichTextEditor, selection: TRange): BasePoint | null => {
  const table = findNode<TableElement>(editor, { match: { type: BaseTablePlugin.node.type } });

  if (table !== undefined) {
    return { path: table[1], offset: 0 };
  }

  return isCollapsed(selection) ? null : Range.start(selection);
};
