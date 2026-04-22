import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@platejs/table';
import { BaseParagraphPlugin } from 'platejs';
import { HeadingOne, HeadingThree, HeadingTwo } from '@/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@/plate/components/lists';
import { Paragraph } from '@/plate/components/paragraph';
import { TableCellElement } from '@/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@/plate/components/plate-ui/table-element';
import { TableRowElement } from '@/plate/components/plate-ui/table-row-element';
import { BookmarkPlugin } from '@/plate/plugins/bookmark';
import { CleanupDocumentPlugin } from '@/plate/plugins/cleanup/cleanup-document';
import { CommentsPlugin } from '@/plate/plugins/comments';
import { CurrentDatePlugin } from '@/plate/plugins/current-date';
import { CycleCasePlugin } from '@/plate/plugins/cycle-case/cycle-case';
import { EmptyVoidPlugin } from '@/plate/plugins/empty-void';
import { FloatingSaksbehandlerToolbarPlugin } from '@/plate/plugins/floating-toolbar';
import { FullmektigPlugin } from '@/plate/plugins/fullmektig';
import { FooterPlugin, HeaderPlugin } from '@/plate/plugins/header-footer';
import { LabelContentPlugin } from '@/plate/plugins/label-content';
import { MaltekstPlugin } from '@/plate/plugins/maltekst';
import { MaltekstseksjonPlugin } from '@/plate/plugins/maltekstseksjon';
import { SaksbehandlerPlaceholderPlugin } from '@/plate/plugins/placeholder/saksbehandler';
import { defaultPlugins } from '@/plate/plugins/plugin-sets/default';
import { ProhibitDeletionPlugin } from '@/plate/plugins/prohibit-deletion/prohibit-deletion';
import { RedigerbarMaltekstPlugin } from '@/plate/plugins/redigerbar-maltekst';
import { RegelverkContainerPlugin, RegelverkPlugin } from '@/plate/plugins/regelverk';
import { SaksnummerPlugin } from '@/plate/plugins/saksnummer';
import { SignaturePlugin } from '@/plate/plugins/signature';
import { WhitespaceDecorationPlugin, WhitespaceIssueLeaf } from '@/plate/plugins/whitespace-decoration';

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
  ProhibitDeletionPlugin,
  WhitespaceDecorationPlugin.configure({ render: { node: WhitespaceIssueLeaf } }),
  CleanupDocumentPlugin,
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
  CycleCasePlugin,
];

export const saksbehandlerPlugins = [...historyPlugins, FloatingSaksbehandlerToolbarPlugin];
