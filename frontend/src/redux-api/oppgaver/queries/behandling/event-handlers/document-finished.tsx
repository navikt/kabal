import { DEFAULT_FILES_VIEWED, getFilesViewed, setFilesViewed } from '@app/hooks/settings/use-setting';
import { reduxStore } from '@app/redux/configure-store';
import { handleJournalpostAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { DocumentFinishedEvent } from '@app/redux-api/server-sent-events/types';

export const handleDocumentFinishedEvent = (oppgaveId: string, userId: string) => (event: DocumentFinishedEvent) => {
  handleJournalpostAddedEvent(oppgaveId, userId)(event);

  const pdfViewed = getFilesViewed(oppgaveId, userId);

  if (pdfViewed.newDocument === event.id || pdfViewed.vedleggsoversikt === event.id) {
    setFilesViewed(oppgaveId, userId, DEFAULT_FILES_VIEWED);
  }

  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (documents) =>
      documents.filter((document) => document.id !== event.id && document.parentId !== event.id),
    ),
  );
};
