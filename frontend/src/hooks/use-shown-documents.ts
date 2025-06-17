import { canOpenInKabal } from '@app/components/documents/filetype';
import type { IShownDocument } from '@app/components/view-pdf/types';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { useMemo } from 'react';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from './settings/use-setting';

interface ShowDocumentResult {
  showDocumentList: IShownDocument[];
  title: string | null;
}

const EMPTY_SHOWN_LIST: IShownDocument[] = [];
const EMPTY_MAIN_LIST: IDocument[] = [];
const EMPTY_ARCHIVED_LIST: IArkivertDocument[] = [];

export const useShownDocuments = (): ShowDocumentResult => {
  const oppgaveId = useOppgaveId();
  const { value: showDocumentList = EMPTY_SHOWN_LIST } = useDocumentsPdfViewed();
  const { data: documentsInProgress = EMPTY_MAIN_LIST } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);

  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED_LIST;

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const title = useMemo(() => {
    if (showDocumentList.length !== 1) {
      return null;
    }

    const [onlyDocument] = showDocumentList;

    if (onlyDocument === undefined) {
      return null;
    }

    if (onlyDocument.type === DocumentTypeEnum.JOURNALFOERT) {
      for (const jp of journalpostDocuments) {
        if (jp.journalpostId === onlyDocument.journalpostId) {
          if (jp.dokumentInfoId === onlyDocument.dokumentInfoId) {
            return canOpenInKabal(jp.varianter) ? jp.tittel : null;
          }

          const vedlegg = jp.vedlegg.find((v) => v.dokumentInfoId === onlyDocument.dokumentInfoId);

          if (vedlegg === undefined || !canOpenInKabal(vedlegg.varianter)) {
            return null;
          }

          return vedlegg.tittel;
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

    if (onlyDocument.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
      return 'Vedleggsoversikt';
    }

    return null;
  }, [documentsInProgress, journalpostDocuments, showDocumentList]);

  return { showDocumentList, title };
};
