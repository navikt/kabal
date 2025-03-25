import {
  getDocumentPath,
  getFirstAccessibleDocumentIndex,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { getHasVisibleVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/visible-vedlegg';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  getLastIndex,
  increment,
} from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getAccessibleDocumentIndex,
  getFocusedVedleggIndex,
  setAccessibleDocumentIndex,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { DocumentPath } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useDown = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback((): DocumentPath => {
    const accessibleDocumentIndex = getAccessibleDocumentIndex();
    const focusedDocument = getDocument(accessibleDocumentIndex);

    if (focusedDocument === undefined) {
      return getDocumentPath(...setAccessibleDocumentIndex(getFirstAccessibleDocumentIndex()));
    }

    const lastVedleggIndex = getLastIndex(focusedDocument.vedlegg);
    const focusedVedleggIndex = getFocusedVedleggIndex();

    if (focusedVedleggIndex !== lastVedleggIndex && getHasVisibleVedlegg(focusedDocument)) {
      const newFocusedVedleggIndex = Math.min(focusedVedleggIndex + 1, lastVedleggIndex);
      setFocusedVedleggIndex(newFocusedVedleggIndex);
      return getDocumentPath(accessibleDocumentIndex, newFocusedVedleggIndex);
    }

    setFocusedVedleggIndex(-1);
    const newAccessibleDocumentIndex = increment(accessibleDocumentIndex, 1, getLastAccessibleDocumentIndex());
    setAccessibleDocumentIndex(newAccessibleDocumentIndex);
    return getDocumentPath(newAccessibleDocumentIndex, -1);
  }, [getDocument]);
};
