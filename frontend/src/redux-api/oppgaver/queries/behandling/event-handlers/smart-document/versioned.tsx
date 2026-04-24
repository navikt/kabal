import { reloadFileInAllViewers } from '@/components/file-viewer/file-viewer-handle-store';
import { getNewDocumentFileUrl } from '@/domain/file-url';
import { documentsQuerySlice } from '@/redux-api/oppgaver/queries/documents';
import type { SmartDocumentVersionedEvent } from '@/redux-api/server-sent-events/types';
import type { Dispatch } from '@/redux-api/types';

export const handleSmartDocumentVersionedEvent =
  (oppgaveId: string, dispatch: Dispatch) =>
  async ({ documentId, author, timestamp, version }: SmartDocumentVersionedEvent) => {
    dispatch(
      documentsQuerySlice.util.updateQueryData(
        'getSmartDocumentVersions',
        { oppgaveId, dokumentId: documentId },
        (draft) => [{ author, timestamp, version }, ...draft],
      ),
    );

    dispatch(
      documentsQuerySlice.util.updateQueryData('getDocument', { oppgaveId, dokumentId: documentId }, (draft) => {
        draft.modified = timestamp;
      }),
    );

    await reloadFileInAllViewers(getNewDocumentFileUrl(oppgaveId, documentId));
  };
