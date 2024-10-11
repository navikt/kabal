import { handleJournalpostAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { DocumentFinishedEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';

export const handleDocumentFinishedEvent = (oppgaveId: string, userId: string) => (event: DocumentFinishedEvent) => {
  handleJournalpostAddedEvent(oppgaveId, userId)(event);

  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (documents) => {
      if (documents === undefined) {
        return documents;
      }

      return documents.filter((document) => document.id !== event.id);
    }),
  );
};
