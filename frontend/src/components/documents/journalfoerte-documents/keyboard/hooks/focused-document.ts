import {
  useGetDocument,
  useGetVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

interface FocusedVedlegg {
  focusedDocument: IArkivertDocument;
  focusedVedlegg: IArkivertDocumentVedlegg;
}

interface FocusedDocument {
  focusedDocument: IArkivertDocument;
  focusedVedlegg: undefined;
}

interface NoFocusedDocument {
  focusedDocument: undefined;
  focusedVedlegg: undefined;
}

type FocusedDocumentResult = FocusedVedlegg | FocusedDocument | NoFocusedDocument;

export const useLazyFocusedDocumentAndVedlegg = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);
  const getFocusedVedlegg = useGetVedlegg();

  return useCallback((): FocusedDocumentResult => {
    const focusedDocument = getDocument();

    if (focusedDocument === undefined) {
      return { focusedDocument: undefined, focusedVedlegg: undefined };
    }

    return { focusedDocument, focusedVedlegg: getFocusedVedlegg(focusedDocument) };
  }, [getDocument, getFocusedVedlegg]);
};
