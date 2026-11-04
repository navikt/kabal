import { BaseTablePlugin } from '@platejs/table';
import { type Point, RangeApi, type TRange } from 'platejs';
import type { RichTextEditor, TableElement } from '@/plate/types';

export const getSelectionStart = (editor: RichTextEditor, selection: TRange): Point | null => {
  const table = editor.api.node<TableElement>({ match: { type: BaseTablePlugin.node.type } });

  if (table !== undefined) {
    return { path: table[1], offset: 0 };
  }

  return RangeApi.isCollapsed(selection) ? null : RangeApi.start(selection);
};
