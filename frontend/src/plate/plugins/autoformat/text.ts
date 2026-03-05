import type { EditorAutoformatRule } from '@app/plate/types';

export const autoformatText: EditorAutoformatRule[] = [
  {
    mode: 'text',
    match: '"',
    format: ['«', '»'],
  },
];
