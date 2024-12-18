import type { UserCursor } from '@app/components/smart-editor/tabbed-editors/cursors/cursors';
import { TAB_UUID } from '@app/headers';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { Paragraph } from '@app/plate/components/paragraph';
import { MaltekstseksjonPlugin } from '@app/plate/plugins/maltekstseksjon';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import type { IUserData } from '@app/types/bruker';
import type { ISmartDocument } from '@app/types/documents/documents';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import { BaseParagraphPlugin } from '@udecode/plate-common';
import type { NodeComponent } from '@udecode/plate-core/react';
import { BaseBulletedListPlugin, BaseListItemPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { YjsPlugin } from '@udecode/plate-yjs/react';
import { XmlText } from 'yjs';

export const components: Record<string, NodeComponent> = {
  [BaseParagraphPlugin.key]: Paragraph,

  // Headings
  // [HEADING_KEYS.h1]: HeadingOne,
  // [HEADING_KEYS.h2]: HeadingTwo,
  // [HEADING_KEYS.h3]: HeadingThree,

  // Lists
  [BaseBulletedListPlugin.key]: UnorderedList,
  [BaseNumberedListPlugin.key]: OrderedList,
  [BaseListItemPlugin.key]: ListItem,

  // Table
  // [BaseTablePlugin.key]: TableElement,
  // [BaseTableCellPlugin.key]: TableCellElement,
  // [BaseTableRowPlugin.key]: TableRowElement,
};

export const saksbehandlerPlugins = [
  ...defaultPlugins,
  // SaksbehandlerPlaceholderPlugin,
  MaltekstseksjonPlugin,
  // MaltekstPlugin,
  RedigerbarMaltekstPlugin,
  // CurrentDatePlugin,
  // RegelverkPlugin,
  // RegelverkContainerPlugin,
  // HeaderPlugin,
  // FooterPlugin,
  // LabelContentPlugin,
  // FullmektigPlugin,
  // SignaturePlugin,
  // EmptyVoidPlugin,
  // CommentsPlugin,
  // BookmarkPlugin,
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
          onMessage: (data) => {
            // console.log('onMessage', decodeUpdate(data.message.data));
          },
          onOutgoingMessage: (data) => {
            const a = data.message.toUint8Array();
            console.log('onOutgoingMessage', a);
            const string = new TextDecoder().decode(a);

            console.log('onOutgoingMessage string', string);

            const sharedRoot: XmlText = data.message.get('content', XmlText);
            const nodes = yTextToSlateElement(sharedRoot);
          },
        },
      },
    }),
  ];
};
