import { DEFAULT_FILES_VIEWED, getFilesViewed, setFilesViewed } from '@/hooks/settings/use-setting';
import { deleteDocumentBackups } from '@/localstorage';
import { handleJournalpostAddedEvent } from '@/redux-api/oppgaver/queries/behandling/event-handlers/journalpost-added';
import { documentsQuerySlice } from '@/redux-api/oppgaver/queries/documents';
import type { DocumentFinishedEvent } from '@/redux-api/server-sent-events/types';
import type { Dispatch } from '@/redux-api/types';
import { DocumentTypeEnum } from '@/types/documents/documents';

export const handleDocumentFinishedEvent =
  (oppgaveId: string, userId: string, dispatch: Dispatch) => (event: DocumentFinishedEvent) => {
    handleJournalpostAddedEvent(oppgaveId, userId, dispatch)(event);

    const pdfViewed = getFilesViewed(oppgaveId, userId);

    if (pdfViewed.newDocument === event.id || pdfViewed.vedleggsoversikt === event.id) {
      setFilesViewed(oppgaveId, userId, DEFAULT_FILES_VIEWED);
    }

    // The event only contains the ID of the main document. Smart vedlegg are collected from the cache.
    const finishedIds = [event.id];

    dispatch(
      documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (documents) =>
        documents.filter((document) => {
          if (document.parentId === event.id) {
            if (document.type === DocumentTypeEnum.SMART) {
              finishedIds.push(document.id);
            }

            return false;
          }

          return document.id !== event.id;
        }),
      ),
    );

    deleteDocumentBackups(oppgaveId, finishedIds);
  };
