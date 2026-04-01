import { reloadFileInAllViewers } from '@/components/file-viewer/file-viewer-handle-store';
import { getNewDocumentFileUrl } from '@/domain/file-url';
import { getReduxStore } from '@/redux/store-ref';
import { documentsQuerySlice } from '@/redux-api/oppgaver/queries/documents';
import type { SmartDocumentVersionedEvent } from '@/redux-api/server-sent-events/types';

export const handleSmartDocumentVersionedEvent =
  (oppgaveId: string) =>
  async ({ documentId, author, timestamp, version }: SmartDocumentVersionedEvent) => {
    getReduxStore().dispatch(
      documentsQuerySlice.util.updateQueryData(
        'getSmartDocumentVersions',
        { oppgaveId, dokumentId: documentId },
        (draft) => [{ author, timestamp, version }, ...draft],
      ),
    );

    getReduxStore().dispatch(
      documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId: documentId }, (draft) => {
        draft.modified = timestamp;
      }),
    );

    await reloadFileInAllViewers(getNewDocumentFileUrl(oppgaveId, documentId));
  };
