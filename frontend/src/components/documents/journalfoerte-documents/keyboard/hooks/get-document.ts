import { useCallback } from 'react';
import { convertAccessibleToRealDocumentPath } from '@/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  getFocusedVedleggIndex,
  getFocusIndex,
} from '@/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { IArkivertDocument } from '@/types/arkiverte-documents';

export const useGetDocument = (filteredDocuments: IArkivertDocument[]) =>
  useCallback(
    (accessibleIndex = getFocusIndex()) => getDocument(filteredDocuments, accessibleIndex),
    [filteredDocuments],
  );

export const getDocument = (filteredDocuments: IArkivertDocument[], accessibleIndex = getFocusIndex()) => {
  const realPath = convertAccessibleToRealDocumentPath(accessibleIndex);

  if (realPath === null) {
    return undefined;
  }

  const [documentIndex] = realPath;

  return filteredDocuments[documentIndex];
};

export const getVedlegg = (focusedDocument: IArkivertDocument, index = getFocusedVedleggIndex()) =>
  focusedDocument.vedlegg[index];
