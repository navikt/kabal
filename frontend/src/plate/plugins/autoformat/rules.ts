import { autoformatArrow, autoformatLegal, autoformatMath, autoformatPunctuation } from '@platejs/autoformat';
import { autoformatBlocks } from '@/plate/plugins/autoformat/blocks';
import { autoformatLists } from '@/plate/plugins/autoformat/lists';
import { autoformatMarks } from '@/plate/plugins/autoformat/marks';
import { autoformatText } from '@/plate/plugins/autoformat/text';
import type { EditorAutoformatRule } from '@/plate/types';

export const autoformatRules: EditorAutoformatRule[] = [
  ...autoformatText,
  ...autoformatBlocks,
  ...autoformatLists,
  ...autoformatMarks,
  ...(autoformatPunctuation as EditorAutoformatRule[]),
  ...(autoformatLegal as EditorAutoformatRule[]),
  ...(autoformatArrow as EditorAutoformatRule[]),
  ...(autoformatMath as EditorAutoformatRule[]),
];
