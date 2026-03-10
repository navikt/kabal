import { canOpenInKabal } from '@app/components/documents/filetype';
import { showDownloadDocumentsToast } from '@app/components/documents/journalfoerte-documents/download-toast';
import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import { getDocument, getVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  getFocusIndex,
  getIsInVedleggList,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { isSelected } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { useCallback, useContext } from 'react';

export const useOpenInline = (filteredDocuments: IArkivertDocument[]) => {
  const { value: shownDocuments, setValue: setShownDocuments } = useDocumentsPdfViewed();
  const { selectedDocuments } = useContext(SelectContext);

  return useCallback(async () => {
    const focusedIndex = getFocusIndex();

    if (selectedDocuments.size > 0 && isSelected(focusedIndex)) {
      const { toOpen, toDownload } = getSelectedDocumentsInOrder(selectedDocuments, filteredDocuments);

      showDownloadDocumentsToast(...toDownload);

      if (
        toOpen.length === shownDocuments.length &&
        shownDocuments.every((d) => d.type === DocumentTypeEnum.JOURNALFOERT && selectedDocuments.has(getId(d)))
      ) {
        // If all selected documents are already open, close them.
        setShownDocuments([]);
        return;
      }

      setShownDocuments(toOpen);
      return;
    }

    const focusedDocument = getDocument(filteredDocuments, focusedIndex);

    if (focusedDocument?.hasAccess !== true) {
      return;
    }

    const { journalpostId } = focusedDocument;
    let dokumentInfoId = focusedDocument.dokumentInfoId;
    let tittel = focusedDocument.tittel ?? journalpostId;
    let varianter = focusedDocument.varianter;

    if (getIsInVedleggList()) {
      const vedlegg = getVedlegg(focusedDocument);

      if (vedlegg === undefined || !vedlegg.hasAccess) {
        return;
      }

      dokumentInfoId = vedlegg.dokumentInfoId;
      tittel = vedlegg.tittel ?? vedlegg.dokumentInfoId;
      varianter = vedlegg.varianter;
    }

    if (!canOpenInKabal(varianter)) {
      showDownloadDocumentsToast({ journalpostId, dokumentInfoId, tittel, varianter });
      return;
    }

    // If exactly this document is open, and no other, close it.
    const isOpen =
      shownDocuments.length === 1 &&
      shownDocuments.every(
        (d) =>
          d.type === DocumentTypeEnum.JOURNALFOERT &&
          d.dokumentInfoId === dokumentInfoId &&
          d.journalpostId === journalpostId,
      );

    if (isOpen) {
      setShownDocuments([]);
      return;
    }

    // If nothing or other documents are open, open this one.
    setShownDocuments([
      {
        type: DocumentTypeEnum.JOURNALFOERT,
        varianter,
        dokumentInfoId,
        journalpostId,
      },
    ]);
  }, [filteredDocuments, selectedDocuments, setShownDocuments, shownDocuments]);
};
