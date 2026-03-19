import type { EditorAutoformatRule } from '@/plate/types';

export const autoformatText: EditorAutoformatRule[] = [
  {
    mode: 'text',
    match: '"',
    format: ['«', '»'],
  },
];
