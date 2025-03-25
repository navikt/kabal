import {
  getDocumentPath,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getLastIndex } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getAccessibleDocumentIndex,
  getIsInVedleggList,
  setAccessibleDocumentIndex,
  setFocusPath,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { DocumentPath } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const home = (): DocumentPath => {
  if (getIsInVedleggList()) {
    return getDocumentPath(...setFocusedVedleggIndex(0));
  }

  return getDocumentPath(...setFocusPath(0, -1));
};

export const useEnd = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback((): DocumentPath => {
    if (getIsInVedleggList()) {
      const accessibleDocumentIndex = getAccessibleDocumentIndex();
      const focusedDocument = getDocument(accessibleDocumentIndex);
      const lastVedleggIndex = getLastIndex(focusedDocument?.vedlegg);
      setFocusedVedleggIndex(lastVedleggIndex);

      return getDocumentPath(accessibleDocumentIndex, lastVedleggIndex);
    }

    const lastAccessibleDocumentIndex = getLastAccessibleDocumentIndex();
    const lastDocument = getDocument(lastAccessibleDocumentIndex);
    setAccessibleDocumentIndex(lastAccessibleDocumentIndex);
    const lastVedleggIndex = getLastIndex(lastDocument?.vedlegg);
    setFocusedVedleggIndex(lastVedleggIndex);

    return getDocumentPath(lastAccessibleDocumentIndex, lastVedleggIndex);
  }, [getDocument]);
};
