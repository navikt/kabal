import { showDownloadDocumentsToast } from '@app/components/documents/journalfoerte-documents/download-toast';
import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import {
  getVedlegg,
  useGetDocument,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import {
  getFocusIndex,
  getIsInVedleggList,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { isSelected } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
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
  const { selectedDocuments } = useContext(SelectContext);
  const getDocument = useGetDocument(filteredDocuments);
  const { getTabRef, setTabRef } = useContext(TabContext);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  return useCallback(async () => {
    const focusedIndex = getFocusIndex();
    const focusedDocument = getDocument(focusedIndex);
    const hasDocument = focusedDocument !== undefined;

    if (!hasDocument) {
      return;
    }

    if (selectedDocuments.size > 0 && isSelected(focusedIndex)) {
      const { toOpen, toDownload } = getSelectedDocumentsInOrder(selectedDocuments, filteredDocuments);
      const { reference } = await getMergedDocumentRef(toOpen).unwrap();
      const tabUrl = getMergedDocumentTabUrl(reference);
      const documentId = getMergedDocumentTabId(reference);

      if (toDownload.length > 0) {
        showDownloadDocumentsToast(...toDownload);
      }

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
  }, [filteredDocuments, getDocument, getMergedDocumentRef, getTabRef, setTabRef, selectedDocuments]);
};
