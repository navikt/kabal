import { convertAccessibleToRealDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  getAccessibleDocumentIndex,
  getFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
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
