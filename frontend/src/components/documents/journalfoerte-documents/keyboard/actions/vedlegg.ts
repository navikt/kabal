import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  getAccessibleDocumentIndex,
  getIsInVedleggList,
  setFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { getShowVedlegg, setShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useCollapseVedlegg = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback(() => {
    if (getIsInVedleggList()) {
      // Focus document.
      setFocusedVedleggIndex(-1);
      return;
    }

    const accessibleDocumentIndex = getAccessibleDocumentIndex();
    const focusedDocument = getDocument(accessibleDocumentIndex);

    if (focusedDocument !== undefined) {
      // Collapse vedlegg list.
      setShowVedlegg(getShowVedlegg().filter((id) => id !== focusedDocument.journalpostId));
    }
  }, [getDocument]);
};

export const useExpandVedlegg = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback(() => {
    if (getIsInVedleggList()) {
      return;
    }

    const focusedDocument = getDocument();
    const showVedleggIdList = getShowVedlegg();

    if (focusedDocument !== undefined && !showVedleggIdList.includes(focusedDocument.journalpostId)) {
      setShowVedlegg([...showVedleggIdList, focusedDocument.journalpostId]);
    }
  }, [getDocument]);
};

export const collapseAllVedlegg = () => setShowVedlegg([]);

export const useExpandAllVedlegg = (filteredDocuments: IArkivertDocument[]) =>
  useCallback(
    () => setShowVedlegg(filteredDocuments.filter((d) => d.vedlegg.length > 0).map((d) => d.journalpostId)),
    [filteredDocuments],
  );
