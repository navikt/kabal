import {
  getFirstAccessibleDocumentIndex,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getLastIndex } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getAccessibleDocumentIndex,
  getFocusedVedleggIndex,
  setAccessibleDocumentIndex,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { clamp } from '@app/functions/clamp';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useEffect } from 'react';

export const useClampOnFilter = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  useEffect(() => {
    const accessibleDocumentIndex = getAccessibleDocumentIndex();

    if (accessibleDocumentIndex === -1) {
      return;
    }

    const clampedAccessibleDocumentIndex = clamp(
      accessibleDocumentIndex,
      getFirstAccessibleDocumentIndex(),
      getLastAccessibleDocumentIndex(),
    );

    setAccessibleDocumentIndex(clampedAccessibleDocumentIndex);

    const focusedVedleggIndex = getFocusedVedleggIndex();

    if (focusedVedleggIndex === -1) {
      return;
    }

    const document = getDocument(clampedAccessibleDocumentIndex);
    const lastVedleggIndex = getLastIndex(document?.vedlegg);

    setFocusedVedleggIndex(clamp(focusedVedleggIndex, -1, lastVedleggIndex));
  }, [getDocument]);
};
