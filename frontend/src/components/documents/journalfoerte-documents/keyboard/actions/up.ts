import { getDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { getHasVisibleVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/visible-vedlegg';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  decrement,
  getLastIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getAccessibleDocumentIndex,
  getIsInVedleggList,
  resetIndexes,
  setFocusPath,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { DocumentPath } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useUp = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback((): DocumentPath => {
    if (getIsInVedleggList()) {
      return getDocumentPath(...setFocusedVedleggIndex((prev) => (prev === 0 ? -1 : Math.max(prev - 1, 0))));
    }

    const nextAccessibleDocumentIndex = decrement(getAccessibleDocumentIndex(), 1, -1, 1);
    const nextDocument = getDocument(nextAccessibleDocumentIndex);

    if (nextDocument === undefined) {
      resetIndexes();

      return getDocumentPath(-1);
    }

    return getDocumentPath(
      ...setFocusPath(
        nextAccessibleDocumentIndex,
        getHasVisibleVedlegg(nextDocument) ? getLastIndex(nextDocument.vedlegg) : -1,
      ),
    );
  }, [getDocument]);
};
