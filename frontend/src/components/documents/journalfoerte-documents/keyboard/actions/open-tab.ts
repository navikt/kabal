import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import {
  useGetDocument,
  useGetVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getIsInVedleggList } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { TabContext } from '@app/components/documents/tab-context';
import { TAB_MANAGER } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import {
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getMergedDocumentTabId,
  getMergedDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { useLazyMergedDocumentsReferenceQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback, useContext } from 'react';

export const useOpenInNewTab = (filteredDocuments: IArkivertDocument[]) => {
  const [getMergedDocumentRef] = useLazyMergedDocumentsReferenceQuery();
  const { isSelected, selectedDocuments, selectedCount } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const getVedlegg = useGetVedlegg();
  const { getTabRef, setTabRef } = useContext(TabContext);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  return useCallback(async () => {
    const focusedDocument = getDocument();
    const hasDocument = focusedDocument !== undefined;

    if (!hasDocument) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const documentsToCombine = getSelectedDocumentsInOrder(selectedDocuments, filteredDocuments, selectedCount);
      const { reference } = await getMergedDocumentRef(documentsToCombine).unwrap();
      const tabUrl = getMergedDocumentTabUrl(reference);
      const documentId = getMergedDocumentTabId(reference);

      const isTabOpen = TAB_MANAGER.isTabOpen(documentId);
      const tabRef = getTabRef(documentId);

      // There is a reference to the tab and it is open.
      if (tabRef !== undefined && !tabRef.closed) {
        tabRef.focus();

        return;
      }

      if (isTabOpen) {
        toast.warning('Dokumentet er allerede åpent i en annen fane');

        return;
      }

      const newTabRef = window.open(tabUrl, documentId);

      if (newTabRef === null) {
        toast.error('Kunne ikke åpne ny fane');

        return;
      }

      setTabRef(documentId, newTabRef);
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

    const documentId = getJournalfoertDocumentTabId(journalpostId, dokumentInfoId);
    const isTabOpen = TAB_MANAGER.isTabOpen(documentId);
    const tabRef = getTabRef(documentId);

    // There is a reference to the tab and it is open.
    if (tabRef !== undefined && !tabRef.closed) {
      tabRef.focus();

      return;
    }

    if (isTabOpen) {
      toast.warning('Dokumentet er allerede åpent i en annen fane');

      return;
    }

    const href = getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId);

    // There is no reference to the tab or it is closed.
    const newTabRef = window.open(href, documentId);

    if (newTabRef === null) {
      toast.error('Kunne ikke åpne dokument i ny fane');

      return;
    }

    setTabRef(documentId, newTabRef);
  }, [
    filteredDocuments,
    getDocument,
    getVedlegg,
    getMergedDocumentRef,
    getTabRef,
    setTabRef,
    isSelected,
    selectedCount,
    selectedDocuments,
  ]);
};
