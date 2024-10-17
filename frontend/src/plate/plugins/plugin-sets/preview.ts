import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { Paragraph } from '@app/plate/components/paragraph';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { EmptyVoidPlugin } from '@app/plate/plugins/empty-void';
import { LabelContentPlugin } from '@app/plate/plugins/label-content';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import { SaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@udecode/plate-table';

export const previewPlugins = [
  ...defaultPlugins,
  SaksbehandlerPlaceholderPlugin,
  MaltekstPlugin,
  RedigerbarMaltekstPlugin,
  LabelContentPlugin,
  EmptyVoidPlugin,
];

export const previewComponents = {
  [BaseParagraphPlugin.key]: Paragraph,

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
};
