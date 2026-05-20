import {
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseH4Plugin,
  BoldRules,
  HeadingRules,
  ItalicRules,
  UnderlineRules,
} from '@platejs/basic-nodes';
import {
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  HeadingPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { TextAlignPlugin } from '@platejs/basic-styles/react';
import { DocxPlugin } from '@platejs/docx';
import { IndentPlugin } from '@platejs/indent/react';
import { BulletedListRules, OrderedListRules } from '@platejs/list-classic';
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
import { CustomAutoFormatRulesPlugin } from '@/plate/plugins/autoformat/custom-rules';
import { DefaultAutoFormatRulesPlugin } from '@/plate/plugins/autoformat/default-rules';
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
      allow: [TableCellPlugin.key, TableRowPlugin.key, TablePlugin.key],
      filter: ([node]: NodeEntry) => Object.isExtensible(node),
    },
  }),
  ParagraphPlugin.withComponent(Paragraph),
  HeadingPlugin.configure({ options: { levels: 4 } }).overrideEditor(({ editor }) => {
    const { addMark } = editor.tf;

    editor.tf.addMark = (key, value) => {
      if (
        editor.api.some({ match: { type: [BaseH1Plugin.key, BaseH2Plugin.key, BaseH3Plugin.key, BaseH4Plugin.key] } })
      ) {
        return;
      }

      addMark(key, value);
    };

    return editor;
  }),
  DefaultAutoFormatRulesPlugin,
  CustomAutoFormatRulesPlugin,
  H1Plugin.configure({ inputRules: [HeadingRules.markdown()] }),
  H2Plugin.configure({ inputRules: [HeadingRules.markdown()] }),
  H3Plugin.configure({ inputRules: [HeadingRules.markdown()] }),
  H4Plugin.configure({ inputRules: [HeadingRules.markdown()] }),
  BoldPlugin.configure({
    render: { node: BoldLeaf },
    inputRules: [BoldRules.markdown({ variant: '*' })],
  }),
  ItalicPlugin.configure({
    render: { node: ItalicLeaf },
    inputRules: [ItalicRules.markdown({ variant: '*' }), ItalicRules.markdown({ variant: '_' })],
  }),
  UnderlinePlugin.configure({
    render: { node: UnderlineLeaf },
    inputRules: [UnderlineRules.markdown()],
  }),
  TablePlugin.configure({ options: { disableMarginLeft: true } })
    .withComponent(TableElement)
    .overrideEditor(withOverrides),
  TableCellPlugin.withComponent(TableCellElement),
  TableRowPlugin.withComponent(TableRowElement),
  ListPlugin.configure({
    inputRules: [
      BulletedListRules.markdown({ variant: '*' }),
      BulletedListRules.markdown({ variant: '-' }),
      OrderedListRules.markdown({ variant: ')' }),
    ],
  }),
  IndentPlugin.configure({
    options: { indentMax: 15, offset: 24, unit: 'pt' },
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        BaseH1Plugin.key,
        BaseH2Plugin.key,
        BaseH3Plugin.key,
        BaseH4Plugin.key,
        TablePlugin.key,
        NumberedListPlugin.key,
        BulletedListPlugin.key,
      ],
    },
  }),
  TextAlignPlugin.configure({ inject: { targetPlugins: [ParagraphPlugin.key] } }),
  ExitBreakPlugin.configure({
    options: {
      rules: [
        { hotkey: 'mod+shift+enter', before: true },
        {
          hotkey: 'enter',
          before: false,
          defaultType: ParagraphPlugin.key,
          query: {
            start: true,
            end: true,
            allow: [BaseH1Plugin.key, BaseH2Plugin.key, BaseH3Plugin.key, BaseH4Plugin.key],
          },
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
