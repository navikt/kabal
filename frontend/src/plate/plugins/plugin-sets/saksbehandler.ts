import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { Paragraph } from '@app/plate/components/paragraph';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { CommentsPlugin } from '@app/plate/plugins/comments';
import { CurrentDatePlugin } from '@app/plate/plugins/current-date';
import { EmptyVoidPlugin } from '@app/plate/plugins/empty-void';
import { FloatingSaksbehandlerToolbarPlugin } from '@app/plate/plugins/floating-toolbar';
import { FullmektigPlugin } from '@app/plate/plugins/fullmektig';
import { FooterPlugin, HeaderPlugin } from '@app/plate/plugins/header-footer';
import { LabelContentPlugin } from '@app/plate/plugins/label-content';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import { MaltekstseksjonPlugin } from '@app/plate/plugins/maltekstseksjon';
import { SaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { RegelverkContainerPlugin, RegelverkPlugin } from '@app/plate/plugins/regelverk';
import { SaksnummerPlugin } from '@app/plate/plugins/saksnummer';
import { SignaturePlugin } from '@app/plate/plugins/signature';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@platejs/table';
import { BaseParagraphPlugin } from 'platejs';

export const components = {
  [BaseParagraphPlugin.key]: Paragraph,

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
};

export const historyPlugins = [
  ...defaultPlugins,
  SaksbehandlerPlaceholderPlugin,
  MaltekstseksjonPlugin,
  MaltekstPlugin,
  RedigerbarMaltekstPlugin,
  CurrentDatePlugin,
  RegelverkPlugin,
  RegelverkContainerPlugin,
  HeaderPlugin,
  FooterPlugin,
  LabelContentPlugin,
  FullmektigPlugin,
  SignaturePlugin,
  EmptyVoidPlugin,
  CommentsPlugin,
  BookmarkPlugin,
  SaksnummerPlugin,
];

export const saksbehandlerPlugins = [...historyPlugins, FloatingSaksbehandlerToolbarPlugin];
