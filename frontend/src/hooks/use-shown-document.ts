import { useMemo } from 'react';
import { IShownDocument } from '@app/components/view-pdf/types';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from './settings/use-setting';

interface ShowDocumentResult {
  showDocumentList: IShownDocument[];
  title: string | null;
}

export const useShownDocument = (): ShowDocumentResult => {
  const oppgaveId = useOppgaveId();
  const { value: shownDocument = [] } = useDocumentsPdfViewed();
  const { data: documentsInProgressData } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);

  const journalpostDocuments = useMemo(() => journalposter?.dokumenter ?? [], [journalposter]);
  const documentsInProgress = useMemo(() => documentsInProgressData ?? [], [documentsInProgressData]);

  const showDocumentList = useMemo(
    () => (Array.isArray(shownDocument) ? shownDocument : [shownDocument]),
    [shownDocument]
  );

  const title = useMemo(() => {
    if (showDocumentList === undefined) {
      return null;
    }

    if (showDocumentList.length !== 1) {
      return `${showDocumentList.length} sammenslåtte dokumenter`;
    }

    const [onlyDocument] = showDocumentList;

    if (onlyDocument === undefined) {
      return null;
    }

    if (onlyDocument.type === DocumentTypeEnum.JOURNALFOERT) {
      for (const jp of journalpostDocuments) {
        if (jp.journalpostId === onlyDocument.journalpostId) {
          if (jp.dokumentInfoId === onlyDocument.dokumentInfoId) {
            return jp.tittel;
          }

          return jp.vedlegg.find((v) => v.dokumentInfoId === onlyDocument.dokumentInfoId)?.tittel ?? null;
        }
      }
    }

    if (onlyDocument.type === DocumentTypeEnum.SMART || onlyDocument.type === DocumentTypeEnum.UPLOADED) {
      for (const doc of documentsInProgress) {
        if (doc.id === onlyDocument.documentId) {
          return doc.tittel;
        }
      }
    }

    return null;
  }, [documentsInProgress, journalpostDocuments, showDocumentList]);

  return { showDocumentList, title };
};
