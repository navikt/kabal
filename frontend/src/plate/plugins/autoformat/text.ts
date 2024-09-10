import type { EditorAutoformatRule } from '../../types';

export const autoformatText: EditorAutoformatRule[] = [
  {
    mode: 'text',
    match: '"',
    format: ['«', '»'],
  },
];
