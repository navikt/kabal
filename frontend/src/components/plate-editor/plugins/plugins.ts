import {
  AutoformatPlugin,
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
import { alignPlugin } from '@app/components/plate-editor/plugins/align';
import { createPageBreakPlugin } from '@app/components/plate-editor/plugins/page-break';
import { components } from '../components';
import { EditorValue, RichTextEditor } from '../types';
import { autoformatPlugin } from './autoformat/plugin';
import { createMaltekstPlugin } from './maltekst';
import { createPlaceholderPlugin } from './placeholder';
import { createRedigerbarMaltekstPlugin } from './redigerbar-maltekst';

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
    createAlignPlugin(alignPlugin),

    createMaltekstPlugin(),
    createRedigerbarMaltekstPlugin(),
    createPlaceholderPlugin(),
    createPageBreakPlugin(),

    createAutoformatPlugin<AutoformatPlugin<EditorValue, RichTextEditor>, EditorValue>(autoformatPlugin),
  ],
  {
    components,
  }
);
