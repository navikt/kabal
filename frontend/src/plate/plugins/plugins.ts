import { createAlignPlugin } from '@udecode/plate-alignment';
import { AutoformatPlugin, createAutoformatPlugin } from '@udecode/plate-autoformat';
import { createBoldPlugin, createItalicPlugin, createUnderlinePlugin } from '@udecode/plate-basic-marks';
import { createExitBreakPlugin, createSoftBreakPlugin } from '@udecode/plate-break';
import { PlatePlugin, PluginOptions, createPlugins, someNode } from '@udecode/plate-common';
import { createFontColorPlugin } from '@udecode/plate-font';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, KEYS_HEADING, createHeadingPlugin } from '@udecode/plate-heading';
import { createIndentPlugin } from '@udecode/plate-indent';
import { ELEMENT_OL, ELEMENT_UL, createListPlugin } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH, createParagraphPlugin } from '@udecode/plate-paragraph';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { ELEMENT_TABLE, createTablePlugin } from '@udecode/plate-table';
import { components } from '@app/plate/components';
import { createBookmarkPlugin } from '@app/plate/plugins/bookmark';
import { createCommentsPlugin } from '@app/plate/plugins/comments';
import { createCopyPlugin } from '@app/plate/plugins/copy';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createEmptyVoidPlugin } from '@app/plate/plugins/empty-void';
import { createFooterPlugin, createHeaderPlugin } from '@app/plate/plugins/header-footer';
import { createRedaktoerPlaceholderPlugin } from '@app/plate/plugins/placeholder/redaktoer';
import { createProhibitDeletionPlugin } from '@app/plate/plugins/prohibit-deletion/prohibit-deletion';
import { createSignaturePlugin } from '@app/plate/plugins/signature';
import { EditorValue, RichTextEditor } from '../types';
import { autoformatPlugin } from './autoformat/plugin';
import { createCurrentDatePlugin } from './current-date';
import { createLabelContentPlugin } from './label-content';
import { createMaltekstPlugin } from './maltekst';
import { createPageBreakPlugin } from './page-break';
import { createSaksbehandlerPlaceholderPlugin } from './placeholder/saksbehandler';
import { createRedigerbarMaltekstPlugin } from './redigerbar-maltekst';
import { createRegelverkContainerPlugin, createRegelverkPlugin } from './regelverk';

const defaultPlugins: PlatePlugin<PluginOptions, EditorValue>[] = [
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
  createAutoformatPlugin<AutoformatPlugin<EditorValue, RichTextEditor>, EditorValue>(autoformatPlugin),
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

export const saksbehandlerPlugins = createPlugins<EditorValue>(
  [
    ...defaultPlugins,
    createSaksbehandlerPlaceholderPlugin(),
    createCommentsPlugin(),
    createMaltekstPlugin(),
    createRedigerbarMaltekstPlugin(),
    createCurrentDatePlugin(),
    createRegelverkPlugin(),
    createRegelverkContainerPlugin(),
    createHeaderPlugin(),
    createFooterPlugin(),
    createLabelContentPlugin(),
    createSignaturePlugin(),
    createEmptyVoidPlugin(),
    createFontColorPlugin(),
    createBookmarkPlugin(),
  ],
  { components },
);

export const redaktoerPlugins = createPlugins<EditorValue>([...defaultPlugins, createRedaktoerPlaceholderPlugin()], {
  components,
});

export const godeFormuleringerPlugins = createPlugins<EditorValue>(
  [
    ...defaultPlugins,
    createSaksbehandlerPlaceholderPlugin(),
    createMaltekstPlugin(),
    createRedigerbarMaltekstPlugin(),
    createLabelContentPlugin(),
  ],
  {
    components,
  },
);
