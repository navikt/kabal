import { DEFAULT_FILES_VIEWED, getFilesViewed, setFilesViewed } from '@/hooks/settings/use-setting';
import { reduxStore } from '@/redux/configure-store';
import { handleJournalpostAddedEvent } from '@/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { documentsQuerySlice } from '@/redux-api/oppgaver/queries/documents';
import type { DocumentFinishedEvent } from '@/redux-api/server-sent-events/types';

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
