import { AutoformatPlugin } from '@platejs/autoformat';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BoldPlugin, HeadingPlugin, ItalicPlugin, UnderlinePlugin } from '@platejs/basic-nodes/react';
import { TextAlignPlugin } from '@platejs/basic-styles/react';
import { DocxPlugin } from '@platejs/docx';
import { IndentPlugin } from '@platejs/indent/react';
import { BulletedListPlugin, ListPlugin, NumberedListPlugin } from '@platejs/list-classic/react';
import { TableCellPlugin, TablePlugin, TableRowPlugin } from '@platejs/table/react';
import { ExitBreakPlugin } from '@platejs/utils';
import { type NodeEntry, NodeIdPlugin, ParserPlugin } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';
import { Paragraph } from '@/plate/components/paragraph';
import { TableCellElement } from '@/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@/plate/components/plate-ui/table-element';
import { TableRowElement } from '@/plate/components/plate-ui/table-row-element';
import { BoldLeaf, ItalicLeaf, UnderlineLeaf } from '@/plate/leaf/marks';
import { AllSearchHitsHighlightLeaf, ReplaceOneHighlightLeaf } from '@/plate/leaf/search-replace';
import { autoformatRules } from '@/plate/plugins/autoformat/rules';
import { InsertPlugin } from '@/plate/plugins/capitalise/capitalise';
import { CopyPlugin } from '@/plate/plugins/copy/copy';
import { CustomAbbreviationPlugin } from '@/plate/plugins/custom-abbreviations/create-custom-abbreviation-plugin';
import { normalizeNodePlugin } from '@/plate/plugins/normalize-node';
import { PageBreakPlugin } from '@/plate/plugins/page-break';
import { PastePlugin } from '@/plate/plugins/paste';
import { ProhibitDeletionPlugin } from '@/plate/plugins/prohibit-deletion/prohibit-deletion';
import { ReplaceOneHighlightPlugin, SearchReplacePlugin } from '@/plate/plugins/search-replace/search-replace';
import { SelectionPlugin } from '@/plate/plugins/selection';
import { withOverrides } from '@/plate/toolbar/table/with-overrides';

export const defaultPlugins = [
  ParserPlugin,
  NodeIdPlugin.configure({
    options: {
      allow: [TableCellPlugin.key, TableRowPlugin.key],
      filter: ([node]: NodeEntry) => Object.isExtensible(node),
    },
  }),
  ParagraphPlugin.withComponent(Paragraph),
  HeadingPlugin.configure({ options: { levels: 3 } }).overrideEditor(({ editor }) => {
    const { addMark } = editor.tf;

    editor.tf.addMark = (key, value) => {
      if (editor.api.some({ match: { type: [BaseH1Plugin.key, BaseH2Plugin.key, BaseH3Plugin.key] } })) {
        return;
      }

      addMark(key, value);
    };

    return editor;
  }),
  BoldPlugin.configure({ render: { node: BoldLeaf } }),
  ItalicPlugin.configure({ render: { node: ItalicLeaf } }),
  UnderlinePlugin.configure({ render: { node: UnderlineLeaf } }),
  TablePlugin.configure({ options: { disableMarginLeft: true } })
    .withComponent(TableElement)
    .overrideEditor(withOverrides),
  TableCellPlugin.withComponent(TableCellElement),
  TableRowPlugin.withComponent(TableRowElement),
  ListPlugin,
  IndentPlugin.configure({
    options: { indentMax: 15, offset: 24, unit: 'pt' },
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        BaseH1Plugin.key,
        BaseH2Plugin.key,
        BaseH3Plugin.key,
        TablePlugin.key,
        NumberedListPlugin.key,
        BulletedListPlugin.key,
      ],
    },
  }),
  TextAlignPlugin.configure({ inject: { targetPlugins: [ParagraphPlugin.key] } }),
  AutoformatPlugin.configure({
    options: {
      rules: autoformatRules,
      enableUndoOnDelete: true,
    },
  }),
  ExitBreakPlugin.configure({
    options: {
      rules: [
        { hotkey: 'mod+shift+enter', before: true },
        {
          hotkey: 'enter',
          before: false,
          defaultType: ParagraphPlugin.key,
          query: { start: true, end: true, allow: [BaseH1Plugin.key, BaseH2Plugin.key, BaseH3Plugin.key] },
          relative: true,
          level: 1,
        },
      ],
    },
  }),
  DocxPlugin,

  // Custom plugins
  PageBreakPlugin,
  ProhibitDeletionPlugin,
  CopyPlugin,
  SelectionPlugin,
  normalizeNodePlugin,
  CustomAbbreviationPlugin,
  PastePlugin,
  ReplaceOneHighlightPlugin.configure({ render: { node: ReplaceOneHighlightLeaf } }),
  SearchReplacePlugin.configure({ render: { node: AllSearchHitsHighlightLeaf } }),
  InsertPlugin,
];
