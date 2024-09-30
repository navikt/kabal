import { HEADING_KEYS } from '@udecode/plate-heading';
import type { EditorAutoformatRule } from '../../types';
import { preFormat } from './utils';

export const autoformatBlocks: EditorAutoformatRule[] = [
  {
    mode: 'block',
    type: HEADING_KEYS.h1,
    match: '# ',
    preFormat,
  },
  {
    mode: 'block',
    type: HEADING_KEYS.h2,
    match: '## ',
    preFormat,
  },
  {
    mode: 'block',
    type: HEADING_KEYS.h3,
    match: '### ',
    preFormat,
  },
];
