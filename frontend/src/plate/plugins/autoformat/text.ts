import { EditorAutoformatRule } from '../../types';

export const autoformatText: EditorAutoformatRule[] = [
  {
    mode: 'text',
    match: '"',
    format: ['«', '»'],
  },
];
