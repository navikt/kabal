import { convertAccessibleToRealDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  getFocusIndex,
  getFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

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
