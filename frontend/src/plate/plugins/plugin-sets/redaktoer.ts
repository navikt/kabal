import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@platejs/table';
import { BaseParagraphPlugin } from 'platejs';
import { HeadingOne, HeadingThree, HeadingTwo } from '@/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@/plate/components/lists';
import { PageBreak } from '@/plate/components/page-break';
import { Paragraph } from '@/plate/components/paragraph';
import { RedaktørPlaceholder } from '@/plate/components/placeholder/placeholder';
import { TableCellElement } from '@/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@/plate/components/plate-ui/table-element';
import { TableRowElement } from '@/plate/components/plate-ui/table-row-element';
import { createCapitalisePlugin } from '@/plate/plugins/capitalise/capitalise';
import { CleanupDocumentPlugin } from '@/plate/plugins/cleanup/cleanup-document';
import { CycleCasePlugin } from '@/plate/plugins/cycle-case/cycle-case';
import { FloatingRedaktørToolbarPlugin } from '@/plate/plugins/floating-toolbar';
import { PageBreakPlugin } from '@/plate/plugins/page-break';
import { RedaktoerPlaceholderPlugin } from '@/plate/plugins/placeholder/redaktoer';
import { defaultPlugins } from '@/plate/plugins/plugin-sets/default';
import { WhitespaceDecorationPlugin, WhitespaceIssueLeaf } from '@/plate/plugins/whitespace-decoration';
import type { IUserData } from '@/types/bruker';

export const redaktørComponents = {
  [BaseParagraphPlugin.key]: Paragraph,
  [PageBreakPlugin.key]: PageBreak,

  // Headings
  [BaseH1Plugin.key]: HeadingOne,
  [BaseH2Plugin.key]: HeadingTwo,
  [BaseH3Plugin.key]: HeadingThree,

  // Lists
  [BaseBulletedListPlugin.key]: UnorderedList,
  [BaseNumberedListPlugin.key]: OrderedList,
  [BaseListItemPlugin.key]: ListItem,

  // Table
  [BaseTablePlugin.key]: TableElement,
  [BaseTableCellPlugin.key]: TableCellElement,
  [BaseTableRowPlugin.key]: TableRowElement,

  // Smart blocks
  [RedaktoerPlaceholderPlugin.key]: RedaktørPlaceholder,
};

export const redaktørPlugins = ({ navIdent }: IUserData) => [
  ...defaultPlugins,
  WhitespaceDecorationPlugin.configure({ render: { node: WhitespaceIssueLeaf } }),
  CleanupDocumentPlugin,
  RedaktoerPlaceholderPlugin,
  FloatingRedaktørToolbarPlugin,
  createCapitalisePlugin(navIdent),
  CycleCasePlugin,
];
