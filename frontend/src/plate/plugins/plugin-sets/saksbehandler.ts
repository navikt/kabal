import type { UserCursor } from '@app/components/smart-editor/tabbed-editors/cursors/cursors';
import { TAB_UUID } from '@app/headers';
import { pushLog } from '@app/observability';
import { CurrentDate } from '@app/plate/components/current-date';
import { EmptyVoid } from '@app/plate/components/empty-void';
import { HeaderFooter } from '@app/plate/components/header-footer';
import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { LabelContent } from '@app/plate/components/label-content';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { Maltekst } from '@app/plate/components/maltekst/maltekst';
import { Maltekstseksjon } from '@app/plate/components/maltekstseksjon/maltekstseksjon';
import { PageBreak } from '@app/plate/components/page-break';
import { Paragraph } from '@app/plate/components/paragraph';
import { SaksbehandlerPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { RedigerbarMaltekst } from '@app/plate/components/redigerbar-maltekst';
import { Regelverk, RegelverkContainer } from '@app/plate/components/regelverk';
import { Signature } from '@app/plate/components/signature/signature';
import { createBookmarkPlugin } from '@app/plate/plugins/bookmark';
import { createCommentsPlugin } from '@app/plate/plugins/comments';
import { createCurrentDatePlugin } from '@app/plate/plugins/current-date';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { createEmptyVoidPlugin } from '@app/plate/plugins/empty-void';
import { createFooterPlugin, createHeaderPlugin } from '@app/plate/plugins/header-footer';
import { createLabelContentPlugin } from '@app/plate/plugins/label-content';
import { createMaltekstPlugin } from '@app/plate/plugins/maltekst';
import { createMaltekstseksjonPlugin } from '@app/plate/plugins/maltekstseksjon';
import { createSaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { createRedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { createRegelverkContainerPlugin, createRegelverkPlugin } from '@app/plate/plugins/regelverk';
import { createSignaturePlugin } from '@app/plate/plugins/signature';
import type { IUserData } from '@app/types/bruker';
import type { ISmartDocument } from '@app/types/documents/documents';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import { type PlatePluginComponent, createPlugins } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import { createYjsPlugin } from '@udecode/plate-yjs';
import * as Y from 'yjs';

const components: Record<string, PlatePluginComponent> = {
  [ELEMENT_PARAGRAPH]: Paragraph,
  [ELEMENT_PAGE_BREAK]: PageBreak,

  // Headings
  [ELEMENT_H1]: HeadingOne,
  [ELEMENT_H2]: HeadingTwo,
  [ELEMENT_H3]: HeadingThree,

  // Lists
  [ELEMENT_UL]: UnorderedList,
  [ELEMENT_OL]: OrderedList,
  [ELEMENT_LI]: ListItem,

  // Table
  [ELEMENT_TABLE]: TableElement,
  [ELEMENT_TD]: TableCellElement,
  [ELEMENT_TR]: TableRowElement,

  // Smart blocks
  [ELEMENT_MALTEKSTSEKSJON]: Maltekstseksjon,
  [ELEMENT_REDIGERBAR_MALTEKST]: RedigerbarMaltekst,
  [ELEMENT_MALTEKST]: Maltekst,
  [ELEMENT_CURRENT_DATE]: CurrentDate,
  [ELEMENT_FOOTER]: HeaderFooter,
  [ELEMENT_HEADER]: HeaderFooter,
  [ELEMENT_LABEL_CONTENT]: LabelContent,
  [ELEMENT_PLACEHOLDER]: SaksbehandlerPlaceholder,
  [ELEMENT_REGELVERK]: Regelverk,
  [ELEMENT_REGELVERK_CONTAINER]: RegelverkContainer,
  [ELEMENT_SIGNATURE]: Signature,
  [ELEMENT_EMPTY_VOID]: EmptyVoid,
};

export const saksbehandlerPlugins = createPlugins(
  [
    ...defaultPlugins,
    createSaksbehandlerPlaceholderPlugin(),
    createCommentsPlugin(),
    createMaltekstseksjonPlugin(),
    createMaltekstPlugin(),
    createRedigerbarMaltekstPlugin(),
    createCurrentDatePlugin(),
    createRegelverkPlugin(),
    createRegelverkContainerPlugin(),
    createHeaderPlugin(),
    createFooterPlugin(),
    createLabelContentPlugin(),
    createSignaturePlugin(),
    createEmptyVoidPlugin(),
    createBookmarkPlugin(),
  ],
  { components },
);

export const collaborationSaksbehandlerPlugins = (
  behandlingId: string,
  dokumentId: string,
  smartDocument: ISmartDocument,
  { navIdent, navn }: IUserData,
) => {
  const sharedRoot = new Y.XmlText();
  sharedRoot.applyDelta(slateNodesToInsertDelta(smartDocument.content));

  const context = { behandlingId, dokumentId };

  return createPlugins(
    [
      ...saksbehandlerPlugins,
      createYjsPlugin({
        options: {
          cursorOptions: {
            data: { navIdent, navn, tabId: TAB_UUID } satisfies UserCursor,
          },
          disableCursors: true,
          hocuspocusProviderOptions: {
            url: `/collaboration/behandlinger/${behandlingId}/dokumenter/${dokumentId}`,
            name: dokumentId,
            document: sharedRoot.doc ?? undefined,
            onAuthenticated: () => pushLog('HocusPocusProvider onAuthenticated', { context }),
            onAuthenticationFailed: (data) =>
              pushLog('HocusPocusProvider authentication onAuthenticationFailed', {
                context: { ...context, ...data },
              }),
            onAwarenessChange: (data) =>
              pushLog('HocusPocusProvider onAwarenessChange', {
                context: { ...context, states: data.states.toString() },
              }),
            onClose: (data) =>
              pushLog('HocusPocusProvider onClose', {
                context: { ...context, code: data.event.code.toString(), reason: data.event.reason },
              }),
            onConnect: () => pushLog('HocusPocusProvider onConnect', { context }),
            onDestroy: () => pushLog('HocusPocusProvider onDestroy', { context }),
            onDisconnect: (data) =>
              pushLog('HocusPocusProvider onDisconnect', {
                context: { ...context, code: data.event.code.toString(), reason: data.event.reason },
              }),
            onOpen: (data) =>
              pushLog('HocusPocusProvider onOpen', { context: { ...context, type: data.event?.type ?? 'undefined' } }),
            onStateless: (data) =>
              pushLog('HocusPocusProvider onStateless', { context: { ...context, payload: data.payload } }),
            onStatus: (data) =>
              pushLog('HocusPocusProvider onStatus', { context: { ...context, status: data.status } }),
            onSynced: (data) =>
              pushLog('HocusPocusProvider onSynced', { context: { ...context, state: String(data.state) } }),
          },
        },
      }),
    ],
    { components },
  );
};
