import { autoformatText } from '@app/plate/plugins/autoformat/text';
import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
} from '@platejs/autoformat';
import type { EditorAutoformatRule } from '../../types';
import { autoformatBlocks } from './blocks';
import { autoformatLists } from './lists';
import { autoformatMarks } from './marks';

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
