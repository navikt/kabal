import { Paragraph } from '@app/plate/components/paragraph';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { BoldLeaf, ItalicLeaf, UnderlineLeaf } from '@app/plate/leaf/marks';
import { autoformatRules } from '@app/plate/plugins/autoformat/rules';
import { CopyPlugin } from '@app/plate/plugins/copy/copy';
import { CustomAbbreviationPlugin } from '@app/plate/plugins/custom-abbreviations/create-custom-abbreviation-plugin';
import { normalizeNodePlugin } from '@app/plate/plugins/normalize-node';
import { PageBreakPlugin } from '@app/plate/plugins/page-break';
import { PastePlugin } from '@app/plate/plugins/paste';
import { ProhibitDeletionPlugin } from '@app/plate/plugins/prohibit-deletion/prohibit-deletion';
import { SelectionPlugin } from '@app/plate/plugins/selection';
import { AutoformatPlugin } from '@platejs/autoformat';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from '@platejs/basic-nodes/react';
import { HeadingPlugin } from '@platejs/basic-nodes/react';
import { TextAlignPlugin } from '@platejs/basic-styles/react';
import { NodeIdPlugin } from '@platejs/core';
import { DocxPlugin } from '@platejs/docx';
import { IndentPlugin } from '@platejs/indent/react';
import { BulletedListPlugin, ListPlugin, NumberedListPlugin } from '@platejs/list-classic/react';
import { TableCellPlugin, TablePlugin, TableRowPlugin } from '@platejs/table/react';
import { ExitBreakPlugin } from '@platejs/utils';
import { type NodeEntry, ParserPlugin } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';

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
  TablePlugin.configure({ options: { disableMarginLeft: true } }).withComponent(TableElement),
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
];
