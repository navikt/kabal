import {
  getFirstAccessibleDocumentIndex,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/accessible-to-real-indexes';
import {
  getAccessibleDocumentIndex,
  getFocusedVedleggIndex,
  setAccessibleDocumentIndex,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/focus';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getLastIndex } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
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

    const document = getDocument(clampedAccessibleDocumentIndex);
    const firstVedleggIndex = document !== undefined && document.vedlegg.length > 0 ? 0 : -1;
    const lastVedleggIndex = getLastIndex(document?.vedlegg);

    setFocusedVedleggIndex(clamp(getFocusedVedleggIndex(), firstVedleggIndex, lastVedleggIndex));
  }, [getDocument]);
};
