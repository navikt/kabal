import { canOpenInKabal } from '@app/components/documents/filetype';
import type { IShownDocument } from '@app/components/view-pdf/types';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { useEffect, useMemo } from 'react';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from './settings/use-setting';

interface ShowDocumentResult {
  showDocumentList: IShownDocument[];
  title: string | null;
  isLoading: boolean;
}

const EMPTY_SHOWN_LIST: IShownDocument[] = [];
const EMPTY_MAIN_LIST: IDocument[] = [];
const EMPTY_ARCHIVED_LIST: IArkivertDocument[] = [];

export const useShownDocuments = (): ShowDocumentResult => {
  const oppgaveId = useOppgaveId();
  const { value: showDocumentList = EMPTY_SHOWN_LIST, setValue: setDocumentList } = useDocumentsPdfViewed();
  const { data: documentsInProgress = EMPTY_MAIN_LIST, isLoading: isDuaLoading } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter, isLoading: isJournalposterLoading } = useGetArkiverteDokumenterQuery(oppgaveId);

  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED_LIST;

  // Filter the showDocumentList to only include documents that still exist and are accessible
  const filteredDocumentList = useMemo(() => {
    if (isDuaLoading || isJournalposterLoading) {
      return showDocumentList;
    }

    return showDocumentList.filter((doc) =>
      doc.type === DocumentTypeEnum.JOURNALFOERT
        ? journalpostDocuments.some(
            (d) => d.hasAccess && d.journalpostId === doc.journalpostId && d.dokumentInfoId === doc.dokumentInfoId,
          )
        : documentsInProgress.some((d) => d.id === doc.documentId),
    );
  }, [documentsInProgress, journalpostDocuments, showDocumentList, isDuaLoading, isJournalposterLoading]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const title = useMemo(() => {
    if (filteredDocumentList.length !== 1) {
      return null;
    }

    const [onlyDocument] = filteredDocumentList;

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
  }, [documentsInProgress, journalpostDocuments, filteredDocumentList]);

  useEffect(() => {
    if (!isDuaLoading && !isJournalposterLoading) {
      setDocumentList((current) => (current?.length === filteredDocumentList.length ? current : filteredDocumentList)); // Update the stored document list
    }
  }, [filteredDocumentList, setDocumentList, isDuaLoading, isJournalposterLoading]);

  return {
    showDocumentList: isDuaLoading || isJournalposterLoading ? EMPTY_SHOWN_LIST : filteredDocumentList,
    title,
    isLoading: isDuaLoading || isJournalposterLoading,
  };
};
