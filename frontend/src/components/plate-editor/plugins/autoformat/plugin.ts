import { AutoformatPlugin } from '@udecode/plate';
import { RichTextEditor, EditorPlatePlugin, EditorValue } from '../../types';
import { autoformatRules } from './rules';

export const autoformatPlugin: Partial<EditorPlatePlugin<AutoformatPlugin<EditorValue, RichTextEditor>>> = {
  options: {
    rules: autoformatRules,
    enableUndoOnDelete: true,
  },
};

