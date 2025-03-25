import { getDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/accessible-to-real-indexes';
import {
  getAccessibleDocumentIndex,
  getIsInVedleggList,
  resetIndexes,
  setAccessibleDocumentIndex,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/focus';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getHasVisibleVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/visible-vedlegg';
import {
  decrement,
  getLastIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import type { DocumentPath } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useUp = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback((): DocumentPath => {
    if (getIsInVedleggList()) {
      return getDocumentPath(
        getAccessibleDocumentIndex(),
        setFocusedVedleggIndex((prev) => (prev === 0 ? -1 : Math.max(prev - 1, 0))),
      );
    }

    const nextAccessibleDocumentIndex = decrement(getAccessibleDocumentIndex(), 1, -1, 1);
    const nextDocument = getDocument(nextAccessibleDocumentIndex);

    if (nextDocument === undefined) {
      resetIndexes();

      return getDocumentPath(-1);
    }

    return getDocumentPath(
      setAccessibleDocumentIndex(nextAccessibleDocumentIndex),
      setFocusedVedleggIndex(getHasVisibleVedlegg(nextDocument) ? getLastIndex(nextDocument.vedlegg) : -1),
    );
  }, [getDocument]);
};
