import { Paragraph } from '@app/plate/components/paragraph';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { BoldLeaf, ItalicLeaf, UnderlineLeaf } from '@app/plate/leaf/marks';
import { autoformatRules } from '@app/plate/plugins/autoformat/rules';
import { CopyPlugin } from '@app/plate/plugins/copy/copy';
import { CustomAbbreviationPlugin } from '@app/plate/plugins/custom-abbreviations/create-custom-abbreviation-plugin';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { normalizeNodePlugin } from '@app/plate/plugins/normalize-node';
import { PageBreakPlugin } from '@app/plate/plugins/page-break';
import { ProhibitDeletionPlugin } from '@app/plate/plugins/prohibit-deletion/prohibit-deletion';
import { SelectionPlugin } from '@app/plate/plugins/selection';
import { AlignPlugin } from '@udecode/plate-alignment/react';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from '@udecode/plate-basic-marks/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { ParserPlugin, someNode } from '@udecode/plate-common';
import { ParagraphPlugin } from '@udecode/plate-common/react';
import { DocxPlugin } from '@udecode/plate-docx';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { BulletedListPlugin, ListPlugin, NumberedListPlugin } from '@udecode/plate-list/react';
import { TableCellPlugin, TablePlugin, TableRowPlugin } from '@udecode/plate-table/react';

export const defaultPlugins = [
  ParserPlugin,
  ParagraphPlugin.withComponent(Paragraph),
  HeadingPlugin.configure({
    options: { levels: 3 },
    extendEditor: ({ editor }) => {
      const { addMark } = editor;

      editor.addMark = (key, value) => {
        if (someNode(editor, { match: { type: [HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3] } })) {
          return;
        }

        addMark(key, value);
      };

      return editor;
    },
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
        HEADING_KEYS.h1,
        HEADING_KEYS.h2,
        HEADING_KEYS.h3,
        TablePlugin.key,
        NumberedListPlugin.key,
        BulletedListPlugin.key,
      ],
    },
  }),
  SoftBreakPlugin.configure({
    options: {
      rules: [
        {
          hotkey: 'shift+enter',
          query: {
            exclude: [ELEMENT_PLACEHOLDER, ELEMENT_MALTEKST, BulletedListPlugin.key, NumberedListPlugin.key],
            allow: [ParagraphPlugin.key],
          },
        },
      ],
    },
  }),
  AlignPlugin.configure({ inject: { targetPlugins: [ParagraphPlugin.key] } }),
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
          query: { start: true, end: true, allow: [HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3] },
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
];
