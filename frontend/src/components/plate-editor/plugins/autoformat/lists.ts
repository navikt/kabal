import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate';
import { EditorAutoformatRule } from '../../types';
import { formatList, preFormat } from './utils';

export const autoformatLists: EditorAutoformatRule[] = [
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['* ', '- '],
    preFormat,
    format: (editor) => formatList(editor, ELEMENT_UL),
  },
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['1. ', '1) '],
    preFormat,
    format: (editor) => formatList(editor, ELEMENT_OL),
  },
];
