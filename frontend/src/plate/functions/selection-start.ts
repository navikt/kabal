import type { RichTextEditor, TableElement } from '@app/plate/types';
import { RangeApi, type TRange } from '@udecode/plate';
import { BaseTablePlugin } from '@udecode/plate-table';
import { type BasePoint, Range } from 'slate';

export const getSelectionStart = (editor: RichTextEditor, selection: TRange): BasePoint | null => {
  const table = editor.api.node<TableElement>({ match: { type: BaseTablePlugin.node.type } });

  if (table !== undefined) {
    return { path: table[1], offset: 0 };
  }

  return RangeApi.isCollapsed(selection) ? null : Range.start(selection);
};
