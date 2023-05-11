import {
  AutoformatPlugin,
  ELEMENT_PARAGRAPH,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCommentsPlugin,
  createHeadingPlugin,
  createIndentPlugin,
  createItalicPlugin,
  createListPlugin,
  createParagraphPlugin,
  createPlugins,
  createSoftBreakPlugin,
  createTablePlugin,
  createUnderlinePlugin,
} from '@udecode/plate';
import { components } from '../components';
import { EditorValue, RichTextEditor } from '../types';
import { autoformatPlugin } from './autoformat/plugin';
import { createCurrentDatePlugin } from './current-date';
import { createMaltekstPlugin } from './maltekst';
import { createPageBreakPlugin } from './page-break';
import { createPlaceholderPlugin } from './placeholder';
import { createRedigerbarMaltekstPlugin } from './redigerbar-maltekst';
import { createRegelverkPlugin } from './regelverk';

export const plugins = createPlugins<EditorValue>(
  [
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createHeadingPlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createTablePlugin(),
    createListPlugin(),
    createIndentPlugin(),
    createSoftBreakPlugin(),
    createCommentsPlugin(),
    createAlignPlugin({
      inject: { props: { validTypes: [ELEMENT_PARAGRAPH] } },
    }),

    createMaltekstPlugin(),
    createRedigerbarMaltekstPlugin(),
    createPlaceholderPlugin(),
    createPageBreakPlugin(),
    createCurrentDatePlugin(),
    createRegelverkPlugin(),

    createAutoformatPlugin<AutoformatPlugin<EditorValue, RichTextEditor>, EditorValue>(autoformatPlugin),
  ],
  {
    components,
  }
);
