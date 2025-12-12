import { getDocumentsPdfViewed, setDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { reduxStore } from '@app/redux/configure-store';
import { handleJournalpostAddedEvent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { DocumentFinishedEvent } from '@app/redux-api/server-sent-events/types';
import { DocumentTypeEnum } from '@app/types/documents/documents';

export const handleDocumentFinishedEvent = (oppgaveId: string, userId: string) => (event: DocumentFinishedEvent) => {
  handleJournalpostAddedEvent(oppgaveId, userId)(event);

  const viewedPdfs = getDocumentsPdfViewed(oppgaveId, userId);

  setDocumentsPdfViewed(
    oppgaveId,
    userId,
    viewedPdfs.filter(
      (pdf) => pdf.type === DocumentTypeEnum.JOURNALFOERT || (pdf.documentId !== event.id && pdf.parentId !== event.id),
    ),
  );

  reduxStore.dispatch(
    documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (documents) =>
      documents.filter((document) => document.id !== event.id && document.parentId !== event.id),
    ),
  );
};
