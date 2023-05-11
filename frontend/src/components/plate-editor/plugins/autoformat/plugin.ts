import { AutoformatPlugin } from '@udecode/plate';
import { EditorPlatePlugin, EditorValue, RichTextEditor } from '../../types';
import { autoformatRules } from './rules';

export const autoformatPlugin: Partial<EditorPlatePlugin<AutoformatPlugin<EditorValue, RichTextEditor>>> = {
  options: {
    rules: autoformatRules,
    enableUndoOnDelete: true,
  },
};
