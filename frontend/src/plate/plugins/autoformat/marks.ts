import { BaseBoldPlugin, BaseItalicPlugin, BaseUnderlinePlugin } from '@platejs/basic-nodes';
import type { EditorAutoformatRule } from '../../types';

export const autoformatMarks: EditorAutoformatRule[] = [
  {
    mode: 'mark',
    type: [BaseBoldPlugin.key, BaseItalicPlugin.key],
    match: '***',
  },
  {
    mode: 'mark',
    type: [BaseUnderlinePlugin.key, BaseItalicPlugin.key],
    match: '__*',
  },
  {
    mode: 'mark',
    type: [BaseUnderlinePlugin.key, BaseBoldPlugin.key],
    match: '__**',
  },
  {
    mode: 'mark',
    type: [BaseUnderlinePlugin.key, BaseBoldPlugin.key, BaseItalicPlugin.key],
    match: '___***',
  },
  {
    mode: 'mark',
    type: BaseBoldPlugin.key,
    match: '**',
  },
  {
    mode: 'mark',
    type: BaseUnderlinePlugin.key,
    match: '__',
  },
  {
    mode: 'mark',
    type: BaseItalicPlugin.key,
    match: '*',
  },
  {
    mode: 'mark',
    type: BaseItalicPlugin.key,
    match: '_',
  },
];
