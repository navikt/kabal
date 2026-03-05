import { autoformatBlocks } from '@app/plate/plugins/autoformat/blocks';
import { autoformatLists } from '@app/plate/plugins/autoformat/lists';
import { autoformatMarks } from '@app/plate/plugins/autoformat/marks';
import { autoformatText } from '@app/plate/plugins/autoformat/text';
import type { EditorAutoformatRule } from '@app/plate/types';
import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
} from '@platejs/autoformat';

export const autoformatRules: EditorAutoformatRule[] = [
  ...autoformatText,
  ...autoformatBlocks,
  ...autoformatLists,
  ...autoformatMarks,
  ...(autoformatPunctuation as EditorAutoformatRule[]),
  ...(autoformatLegal as EditorAutoformatRule[]),
  ...(autoformatLegalHtml as EditorAutoformatRule[]),
  ...(autoformatArrow as EditorAutoformatRule[]),
  ...(autoformatMath as EditorAutoformatRule[]),
];
