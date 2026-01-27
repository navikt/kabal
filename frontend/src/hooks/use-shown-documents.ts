import { canOpenInKabal } from '@app/components/documents/filetype';
import type { IShownDocument } from '@app/components/file-viewer/types';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument, Variants } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useMemo } from 'react';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';
import { useFilesViewed } from './settings/use-setting';

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
  const { value: pdfViewed } = useFilesViewed();
  const { data: documentsInProgress = EMPTY_MAIN_LIST, isLoading: isDuaLoading } = useGetDocumentsQuery(oppgaveId);
  const { data: journalposter, isLoading: isJournalposterLoading } = useGetArkiverteDokumenterQuery(oppgaveId);

  const isLoading = isDuaLoading || isJournalposterLoading;
  const journalpostDocuments = journalposter?.dokumenter ?? EMPTY_ARCHIVED_LIST;

  // Filter stored IDs and hydrate into IShownDocument[] in a single pass to avoid redundant lookups.
  const showDocumentList = useMemo((): IShownDocument[] => {
    if (isLoading) {
      return EMPTY_SHOWN_LIST;
    }

    if (pdfViewed.vedleggsoversikt !== undefined) {
      const exists = documentsInProgress.some((d) => d.id === pdfViewed.vedleggsoversikt);

      if (!exists) {
        return EMPTY_SHOWN_LIST;
      }

      return [{ type: DocumentTypeEnum.VEDLEGGSOVERSIKT, documentId: pdfViewed.vedleggsoversikt, parentId: null }];
    }

    if (pdfViewed.newDocument !== undefined) {
      const found = documentsInProgress.find((d) => d.id === pdfViewed.newDocument);

      if (found === undefined || found.type === DocumentTypeEnum.JOURNALFOERT) {
        return EMPTY_SHOWN_LIST;
      }

      return [{ type: found.type, documentId: found.id, parentId: found.parentId }];
    }

    const docs: IShownDocument[] = [];

    for (const ref of pdfViewed.archivedFiles) {
      const varianter = findAccessibleVarianter(ref, journalpostDocuments);

      if (varianter !== undefined) {
        docs.push({
          type: DocumentTypeEnum.JOURNALFOERT,
          journalpostId: ref.journalpostId,
          dokumentInfoId: ref.dokumentInfoId,
          varianter,
        });
      }
    }

    return docs;
  }, [pdfViewed, documentsInProgress, journalpostDocuments, isLoading]);

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

  return {
    showDocumentList: isLoading ? EMPTY_SHOWN_LIST : showDocumentList,
    title,
    isLoading,
  };
};

/**
 * Finds the varianter for a document reference, but only if the document is accessible.
 * Returns undefined if the document is not found or the user does not have access.
 */
const findAccessibleVarianter = (
  ref: IJournalfoertDokumentId,
  journalpostDocuments: IArkivertDocument[],
): Variants | undefined => {
  for (const j of journalpostDocuments) {
    if (j.journalpostId !== ref.journalpostId) {
      continue;
    }

    if (j.dokumentInfoId === ref.dokumentInfoId) {
      return j.hasAccess ? j.varianter : undefined;
    }

    for (const v of j.vedlegg) {
      if (v.dokumentInfoId === ref.dokumentInfoId) {
        return v.hasAccess ? v.varianter : undefined;
      }
    }

    return undefined;
  }

  return undefined;
};
