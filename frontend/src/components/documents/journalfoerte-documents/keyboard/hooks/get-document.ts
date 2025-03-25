import { convertAccessibleToRealDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/accessible-to-real-indexes';
import {
  getAccessibleDocumentIndex,
  getFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/focus';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useGetDocument = (filteredDocuments: IArkivertDocument[]) =>
  useCallback(
    (accessibleIndex = getAccessibleDocumentIndex()) =>
      filteredDocuments[convertAccessibleToRealDocumentIndex(accessibleIndex)],
    [filteredDocuments],
  );

export const useGetVedlegg = () =>
  useCallback(
    (focusedDocument: IArkivertDocument, index = getFocusedVedleggIndex()) => focusedDocument.vedlegg[index],
    [],
  );
