import { createAlignPlugin } from '@udecode/plate-alignment';
import { createAutoformatPlugin } from '@udecode/plate-autoformat';
import { createBoldPlugin, createItalicPlugin, createUnderlinePlugin } from '@udecode/plate-basic-marks';
import { createExitBreakPlugin, createSoftBreakPlugin } from '@udecode/plate-break';
import { PlatePlugin, createInsertDataPlugin, someNode } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, KEYS_HEADING, createHeadingPlugin } from '@udecode/plate-heading';
import { createIndentPlugin } from '@udecode/plate-indent';
import { ELEMENT_OL, ELEMENT_UL, createListPlugin } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH, createParagraphPlugin } from '@udecode/plate-paragraph';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { ELEMENT_TABLE, createTablePlugin } from '@udecode/plate-table';
import { createCopyPlugin } from '@app/plate/plugins/copy';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createPageBreakPlugin } from '@app/plate/plugins/page-break';
import { createProhibitDeletionPlugin } from '@app/plate/plugins/prohibit-deletion/prohibit-deletion';
import { autoformatPlugin } from '../autoformat/plugin';

export const defaultPlugins: PlatePlugin[] = [
  createInsertDataPlugin(),
  createParagraphPlugin(),
  createHeadingPlugin({
    options: { levels: 3 },
    withOverrides: (editor) => {
      const { addMark } = editor;

      editor.addMark = (key, value) => {
        if (someNode(editor, { match: { type: [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3] } })) {
          return;
        }

        addMark(key, value);
      };

      return editor;
    },
  }),
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createTablePlugin({ options: { disableMarginLeft: true } }),
  createListPlugin(),
  createIndentPlugin({
    options: { indentMax: 15, offset: 24, unit: 'pt' },
    inject: {
      props: {
        validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_TABLE, ELEMENT_OL, ELEMENT_UL],
      },
    },
  }),
  createSoftBreakPlugin({
    options: {
      rules: [
        {
          hotkey: 'shift+enter',
          query: {
            exclude: [ELEMENT_PLACEHOLDER, ELEMENT_MALTEKST, ELEMENT_UL, ELEMENT_OL],
            allow: [ELEMENT_PARAGRAPH],
          },
        },
      ],
    },
  }),
  createAlignPlugin({ inject: { props: { validTypes: [ELEMENT_PARAGRAPH] } } }),
  createAutoformatPlugin(autoformatPlugin),
  createExitBreakPlugin({
    options: {
      rules: [
        { hotkey: 'mod+shift+enter', before: true },
        {
          hotkey: 'enter',
          before: false,
          defaultType: ELEMENT_PARAGRAPH,
          query: { start: true, end: true, allow: KEYS_HEADING },
          relative: true,
          level: 1,
        },
      ],
    },
  }),
  createDeserializeDocxPlugin(),

  // Custom plugins
  createPageBreakPlugin(),
  createProhibitDeletionPlugin(),
  createCopyPlugin(),
];
