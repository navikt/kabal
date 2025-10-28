import {
  convertAccessibleToRealDocumentPath,
  convertRealToAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  getFocusIndex,
  getIsInVedleggList,
  setFocusIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { useShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useCollapseVedlegg = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);
  const { value: showVedleggIdList, setValue: setShowVedleggIdList } = useShowVedlegg();

  return useCallback(() => {
    if (getIsInVedleggList()) {
      // Focus document.
      const realPath = convertAccessibleToRealDocumentPath(getFocusIndex());

      if (realPath === null) {
        return;
      }

      const [documentIndex] = realPath;

      const accessibleDocumentIndex = convertRealToAccessibleDocumentIndex([documentIndex, -1]);
      setFocusIndex(accessibleDocumentIndex);
      return;
    }

    const accessibleDocumentIndex = getFocusIndex();
    const focusedDocument = getDocument(accessibleDocumentIndex);

    if (focusedDocument !== undefined) {
      // Collapse vedlegg list.
      setShowVedleggIdList(showVedleggIdList.filter((id) => id !== focusedDocument.journalpostId));
    }
  }, [getDocument, setShowVedleggIdList, showVedleggIdList]);
};

export const useExpandVedlegg = (filteredDocuments: IArkivertDocument[]) => {
  const getDocument = useGetDocument(filteredDocuments);
  const { value: showVedleggIdList, setValue: setShowVedleggIdList } = useShowVedlegg();

  return useCallback(() => {
    if (getIsInVedleggList()) {
      return;
    }

    const focusedDocument = getDocument();

    if (focusedDocument !== undefined && !showVedleggIdList.includes(focusedDocument.journalpostId)) {
      setShowVedleggIdList([...showVedleggIdList, focusedDocument.journalpostId]);
    }
  }, [getDocument, setShowVedleggIdList, showVedleggIdList]);
};

export const useCollapseAllVedlegg = () => {
  const { setValue: setShowVedleggIdList } = useShowVedlegg();

  return useCallback(() => setShowVedleggIdList([]), [setShowVedleggIdList]);
};

export const useExpandAllVedlegg = (filteredDocuments: IArkivertDocument[]) => {
  const { setValue: setShowVedleggIdList } = useShowVedlegg();

  return useCallback(
    () => setShowVedleggIdList(filteredDocuments.filter((d) => d.vedlegg.length > 0).map((d) => d.journalpostId)),
    [filteredDocuments, setShowVedleggIdList],
  );
};
