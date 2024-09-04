import { reduxStore } from '@app/redux/configure-store';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import { SmartDocumentVersionedEvent } from '@app/redux-api/server-sent-events/types';

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
