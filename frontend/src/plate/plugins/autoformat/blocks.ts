import { preFormat } from '@app/plate/plugins/autoformat/utils';
import type { EditorAutoformatRule } from '@app/plate/types';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';

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
