import { AutoformatPlugin } from '@udecode/plate-autoformat';
import { EditorPlatePlugin } from '../../types';
import { autoformatRules } from './rules';

export const autoformatPlugin: Partial<EditorPlatePlugin<AutoformatPlugin>> = {
  options: {
    rules: autoformatRules,
    enableUndoOnDelete: true,
  },
};
