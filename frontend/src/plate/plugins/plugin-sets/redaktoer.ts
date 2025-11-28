import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { PageBreak } from '@app/plate/components/page-break';
import { Paragraph } from '@app/plate/components/paragraph';
import { RedaktørPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { createCapitalisePlugin } from '@app/plate/plugins/capitalise/capitalise';
import { FloatingRedaktørToolbarPlugin } from '@app/plate/plugins/floating-toolbar';
import { PageBreakPlugin } from '@app/plate/plugins/page-break';
import { RedaktoerPlaceholderPlugin } from '@app/plate/plugins/placeholder/redaktoer';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import type { IUserData } from '@app/types/bruker';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from '@platejs/core';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@platejs/table';

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
  RedaktoerPlaceholderPlugin,
  FloatingRedaktørToolbarPlugin,
  createCapitalisePlugin(navIdent),
];
