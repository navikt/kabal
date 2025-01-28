import type { UserCursor } from '@app/components/smart-editor/tabbed-editors/cursors/cursors';
import { TAB_UUID } from '@app/headers';
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
import { FullmektigPlugin } from '@app/plate/plugins/fullmektig';
import { FooterPlugin, HeaderPlugin } from '@app/plate/plugins/header-footer';
import { LabelContentPlugin } from '@app/plate/plugins/label-content';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import { MaltekstseksjonPlugin } from '@app/plate/plugins/maltekstseksjon';
import { SaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { RegelverkContainerPlugin, RegelverkPlugin } from '@app/plate/plugins/regelverk';
import { SignaturePlugin } from '@app/plate/plugins/signature';
import type { IUserData } from '@app/types/bruker';
import type { ISmartDocument } from '@app/types/documents/documents';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import { BaseParagraphPlugin } from '@udecode/plate-common';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@udecode/plate-table';
import { YjsPlugin } from '@udecode/plate-yjs/react';
import { XmlText } from 'yjs';

export const components = {
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

export const saksbehandlerPlugins = [
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
];

export const collaborationSaksbehandlerPlugins = (
  behandlingId: string,
  dokumentId: string,
  smartDocument: ISmartDocument,
  { navIdent, navn }: IUserData,
) => {
  const sharedRoot = new XmlText();
  sharedRoot.applyDelta(slateNodesToInsertDelta(smartDocument.content));

  return [
    ...saksbehandlerPlugins,
    YjsPlugin.configure({
      options: {
        cursorOptions: {
          data: { navIdent, navn, tabId: TAB_UUID } satisfies UserCursor,
        },
        disableCursors: true,
        hocuspocusProviderOptions: {
          url: `/collaboration/behandlinger/${behandlingId}/dokumenter/${dokumentId}`,
          name: dokumentId,
          document: sharedRoot.doc ?? undefined,
          onClose: ({ event }) => {
            if (event.code === 4401) {
              window.location.assign('/oauth2/login');
            }
          },
        },
      },
    }),
  ];
};
