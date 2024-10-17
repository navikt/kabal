import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { PageBreak } from '@app/plate/components/page-break';
import { Paragraph } from '@app/plate/components/paragraph';
import { RedaktørPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { PageBreakPlugin } from '@app/plate/plugins/page-break';
import { RedaktoerPlaceholderPlugin } from '@app/plate/plugins/placeholder/redaktoer';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@udecode/plate-table';

export const redaktørComponents = {
  [BaseParagraphPlugin.key]: Paragraph,
  [PageBreakPlugin.key]: PageBreak,

  // Headings
  [HEADING_KEYS.h1]: HeadingOne,
  [HEADING_KEYS.h2]: HeadingTwo,
  [HEADING_KEYS.h3]: HeadingThree,

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

export const redaktørPlugins = [...defaultPlugins, RedaktoerPlaceholderPlugin];
