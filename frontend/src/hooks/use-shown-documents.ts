import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { useMemo } from 'react';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from './settings/use-setting';

const EMPTY_MAIN_LIST: IMainDocument[] = [];
const EMPTY_ARCHIVED_LIST: IArkivertDocument[] = [];

export const useShownDocuments = (): string | null => {
  const oppgaveId = useOppgaveId();
  const { value: viewDocument } = useDocumentsPdfViewed();
  const { data: documentsInProgress = EMPTY_MAIN_LIST } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter } = useGetArkiverteDokumenterQuery(oppgaveId);

  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED_LIST;

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  return useMemo(() => {
    if (viewDocument.documents.length !== 1) {
      return null;
    }

    const [onlyDocument] = viewDocument.documents;

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

    if (onlyDocument.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
      return 'Vedleggsoversikt';
    }

    return null;
  }, [documentsInProgress, journalpostDocuments, viewDocument]);
};
