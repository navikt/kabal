import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import {
  useGetDocument,
  useGetVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getIsInVedleggList } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { useCallback, useContext } from 'react';

export const useOpenInline = (filteredDocuments: IArkivertDocument[]) => {
  const { value: shownDocuments, setValue: setShownDocuments } = useDocumentsPdfViewed();
  const { isSelected, selectedDocuments, selectedCount } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const getVedlegg = useGetVedlegg();

  return useCallback(async () => {
    const focusedDocument = getDocument();
    const hasDocument = focusedDocument !== undefined;

    if (!hasDocument) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const selectedDocumentsInOrder = getSelectedDocumentsInOrder(selectedDocuments, filteredDocuments, selectedCount);

      if (
        selectedDocumentsInOrder.length === shownDocuments.length &&
        shownDocuments.every((d) => d.type === DocumentTypeEnum.JOURNALFOERT && selectedDocuments.has(getId(d)))
      ) {
        // If all selected documents are already open, close them.
        setShownDocuments([]);
        return;
      }

      setShownDocuments(selectedDocumentsInOrder);
      return;
    }

    if (!focusedDocument.hasAccess) {
      return;
    }

    const { journalpostId } = focusedDocument;
    let dokumentInfoId = focusedDocument.dokumentInfoId;

    if (getIsInVedleggList()) {
      const vedlegg = getVedlegg(focusedDocument);

      if (vedlegg === undefined || !vedlegg.hasAccess) {
        return;
      }

      dokumentInfoId = vedlegg.dokumentInfoId;
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
        dokumentInfoId,
        journalpostId,
      },
    ]);
  }, [
    filteredDocuments,
    getDocument,
    getVedlegg,
    isSelected,
    selectedCount,
    selectedDocuments,
    setShownDocuments,
    shownDocuments,
  ]);
};
