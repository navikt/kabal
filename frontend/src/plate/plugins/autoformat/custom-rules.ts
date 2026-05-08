import { createSlatePlugin, createTextSubstitutionInputRule, KEYS } from 'platejs';
import type { PlateEditor } from 'platejs/react';

const isTextSubstitutionBlocked = (editor: PlateEditor) =>
  editor.api.some({ match: { type: [editor.getType(KEYS.codeBlock)] } });

export const CustomAutoFormatRulesPlugin = createSlatePlugin({
  key: 'shortcuts',
  inputRules: [
    createTextSubstitutionInputRule({
      enabled: ({ editor }) => !isTextSubstitutionBlocked(editor),
      patterns: [{ match: '"', format: ['«', '»'] }],
    }),
  ],
});
