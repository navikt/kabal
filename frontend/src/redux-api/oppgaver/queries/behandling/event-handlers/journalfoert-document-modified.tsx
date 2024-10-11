import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { documentsQuerySlice } from '@app/redux-api/oppgaver/queries/documents';
import type { JournalfoertDocumentModifiedEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import { DocumentTypeEnum } from '@app/types/documents/documents';

export const handleJournalfoertDocumentModified =
  (oppgaveId: string, userId: string) => (event: JournalfoertDocumentModifiedEvent) => {
    reduxStore.dispatch(
      documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (draft) => {
        if (draft === undefined) {
          return draft;
        }

        let oldTitle = '';

        for (const document of draft.dokumenter) {
          if (document.dokumentInfoId === event.dokumentInfoId) {
            oldTitle = document.tittel ?? '';
            document.tittel = event.tittel;
          }

          for (const vedlegg of document.vedlegg) {
            if (vedlegg.dokumentInfoId === event.dokumentInfoId) {
              oldTitle = vedlegg.tittel ?? '';
              vedlegg.tittel = event.tittel;

              break;
            }
          }
        }

        if (event.actor.navIdent === userId) {
          return draft;
        }

        if (oldTitle !== event.tittel) {
          toast.info(
            <InfoToast title="Journalført dokument endret">
              «{oldTitle}» har blitt omdøpt til «{event.tittel}» av {formatEmployeeName(event.actor)}.
            </InfoToast>,
          );
        }

        return draft;
      }),
    );

    reduxStore.dispatch(
      documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
        if (draft === undefined) {
          return draft;
        }

        return draft.map((document) => {
          if (
            document.type === DocumentTypeEnum.JOURNALFOERT &&
            document.journalfoertDokumentReference.dokumentInfoId === event.dokumentInfoId &&
            document.tittel !== event.tittel
          ) {
            return { ...document, tittel: event.tittel };
          }

          return document;
        });
      }),
    );
  };
