import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import type { EditorAutoformatRule } from '../../types';
import { formatList, preFormat } from './utils';

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
