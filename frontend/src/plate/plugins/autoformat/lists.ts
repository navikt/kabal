import { formatList, preFormat } from '@app/plate/plugins/autoformat/utils';
import type { EditorAutoformatRule } from '@app/plate/types';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';

export const autoformatLists: EditorAutoformatRule[] = [
  {
    mode: 'block',
    type: BaseListItemPlugin.node.type,
    match: ['* ', '- '],
    preFormat,
    format: (editor) => formatList(editor, BaseBulletedListPlugin.node.type),
  },
  {
    mode: 'block',
    type: BaseListItemPlugin.node.type,
    match: ['1. ', '1) '],
    preFormat,
    format: (editor) => formatList(editor, BaseNumberedListPlugin.node.type),
  },
];
