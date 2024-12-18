import { WrapperPlugin } from '@app/plate/plugins/wrapper';
import { ListPlugin } from '@udecode/plate-list/react';

export const defaultPlugins = [
  // ParserPlugin,
  // ParagraphPlugin.withComponent(Paragraph),
  // HeadingPlugin.configure({
  //   options: { levels: 3 },
  //   extendEditor: ({ editor }) => {
  //     const { addMark } = editor;

  //     editor.addMark = (key, value) => {
  //       if (someNode(editor, { match: { type: [HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3] } })) {
  //         return;
  //       }

  //       addMark(key, value);
  //     };

  //     return editor;
  //   },
  // }),
  // BoldPlugin.configure({ render: { node: BoldLeaf } }),
  // ItalicPlugin.configure({ render: { node: ItalicLeaf } }),
  // UnderlinePlugin.configure({ render: { node: UnderlineLeaf } }),
  // TablePlugin.configure({ options: { disableMarginLeft: true } }).withComponent(TableElement),
  // TableCellPlugin.withComponent(TableCellElement),
  // TableRowPlugin.withComponent(TableRowElement),
  ListPlugin,
  WrapperPlugin,
  // IndentPlugin.configure({
  //   options: { indentMax: 15, offset: 24, unit: 'pt' },
  //   inject: {
  //     targetPlugins: [
  //       ParagraphPlugin.key,
  //       HEADING_KEYS.h1,
  //       HEADING_KEYS.h2,
  //       HEADING_KEYS.h3,
  //       TablePlugin.key,
  //       NumberedListPlugin.key,
  //       BulletedListPlugin.key,
  //     ],
  //   },
  // }),
  // SoftBreakPlugin.configure({
  //   options: {
  //     rules: [
  //       {
  //         hotkey: 'shift+enter',
  //         query: {
  //           exclude: [ELEMENT_PLACEHOLDER, ELEMENT_MALTEKST, BulletedListPlugin.key, NumberedListPlugin.key],
  //           allow: [ParagraphPlugin.key],
  //         },
  //       },
  //     ],
  //   },
  // }),
  // AlignPlugin.configure({ inject: { targetPlugins: [ParagraphPlugin.key] } }),
  // AutoformatPlugin.configure({
  //   options: {
  //     rules: autoformatRules,
  //     enableUndoOnDelete: true,
  //   },
  // }),
  // ExitBreakPlugin.configure({
  //   options: {
  //     rules: [
  //       { hotkey: 'mod+shift+enter', before: true },
  //       {
  //         hotkey: 'enter',
  //         before: false,
  //         defaultType: ParagraphPlugin.key,
  //         query: { start: true, end: true, allow: [HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3] },
  //         relative: true,
  //         level: 1,
  //       },
  //     ],
  //   },
  // }),
  // DocxPlugin,

  // Custom plugins
  // PageBreakPlugin,
  // ProhibitDeletionPlugin,
  // CopyPlugin,
  // SelectionPlugin,
  // normalizeNodePlugin,
  // CustomAbbreviationPlugin,
  // PastePlugin,
];
