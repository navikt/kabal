import { useCallback } from 'react';
import { getVedlegg, useGetDocument } from '@/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@/types/arkiverte-documents';

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

  return useCallback((): FocusedDocumentResult => {
    const focusedDocument = getDocument();

    if (focusedDocument === undefined) {
      return { focusedDocument: undefined, focusedVedlegg: undefined };
    }

    return { focusedDocument, focusedVedlegg: getVedlegg(focusedDocument) };
  }, [getDocument]);
};
