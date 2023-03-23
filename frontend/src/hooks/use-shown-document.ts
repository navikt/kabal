import { useMemo } from 'react';
import { DocumentTypeEnum, IShownDocument } from '@app/components/show-document/types';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from './settings/use-setting';

interface DocumentTitle {
  tittel: string | null;
}

type TitledShownDocument = IShownDocument & DocumentTitle;

export const useShownDocument = (): TitledShownDocument | undefined => {
  const oppgaveId = useOppgaveId();
  const { value: shownDocument } = useDocumentsPdfViewed();
  const { data: documentsInProgressData } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);

  const journalpostDocuments = useMemo(() => journalposter?.dokumenter ?? [], [journalposter]);
  const documentsInProgress = useMemo(() => documentsInProgressData ?? [], [documentsInProgressData]);

  const tittel = useMemo(() => {
    if (shownDocument === undefined) {
      return undefined;
    }

    if (shownDocument.type === DocumentTypeEnum.ARCHIVED) {
      for (const jp of journalpostDocuments) {
        if (jp.journalpostId === shownDocument.journalpostId) {
          if (jp.dokumentInfoId === shownDocument.dokumentInfoId) {
            return jp.tittel;
          }

          return jp.vedlegg.find((v) => v.dokumentInfoId === shownDocument.dokumentInfoId)?.tittel;
        }
      }
    }

    if (shownDocument.type === DocumentTypeEnum.SMART || shownDocument.type === DocumentTypeEnum.FILE) {
      for (const doc of documentsInProgress) {
        if (doc.id === shownDocument.documentId) {
          return doc.tittel;
        }
      }
    }

    return undefined;
  }, [documentsInProgress, journalpostDocuments, shownDocument]);

  if (tittel === undefined || shownDocument === undefined) {
    return undefined;
  }

  return { ...shownDocument, tittel };
};
