import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { preFormat } from '@/plate/plugins/autoformat/utils';
import type { EditorAutoformatRule } from '@/plate/types';

export const autoformatBlocks: EditorAutoformatRule[] = [
  {
    mode: 'block',
    type: BaseH1Plugin.key,
    match: '# ',
    preFormat,
  },
  {
    mode: 'block',
    type: BaseH2Plugin.key,
    match: '## ',
    preFormat,
  },
  {
    mode: 'block',
    type: BaseH3Plugin.key,
    match: '### ',
    preFormat,
  },
];
