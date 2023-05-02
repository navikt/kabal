import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
  autoformatSmartQuotes,
} from '@udecode/plate';
import { EditorAutoformatRule } from '../../types';
import { autoformatBlocks } from './blocks';
import { autoformatLists } from './lists';
import { autoformatMarks } from './marks';

export const autoformatRules: EditorAutoformatRule[] = [
  ...autoformatBlocks,
  ...autoformatLists,
  ...autoformatMarks,
  ...(autoformatSmartQuotes as EditorAutoformatRule[]),
  ...(autoformatPunctuation as EditorAutoformatRule[]),
  ...(autoformatLegal as EditorAutoformatRule[]),
  ...(autoformatLegalHtml as EditorAutoformatRule[]),
  ...(autoformatArrow as EditorAutoformatRule[]),
  ...(autoformatMath as EditorAutoformatRule[]),
];
