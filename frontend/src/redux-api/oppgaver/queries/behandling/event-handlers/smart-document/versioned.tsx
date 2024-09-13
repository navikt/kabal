import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { SmartDocumentVersionedEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';

export const handleSmartDocumentVersionedEvent =
  (oppgaveId: string) =>
  ({ documentId, author, timestamp, version }: SmartDocumentVersionedEvent) => {
    reduxStore.dispatch(
      documentsQuerySlice.util.updateQueryData(
        'getSmartDocumentVersions',
        { oppgaveId, dokumentId: documentId },
        (draft) => {
          draft.push({ author, timestamp, version });
        },
      ),
    );
  };
