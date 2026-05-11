import { useCallback, useContext, useMemo } from 'react';
import { showDownloadDocumentsToast } from '@/components/documents/journalfoerte-documents/download-toast';
import { getSelectedDocumentsInOrder } from '@/components/documents/journalfoerte-documents/heading/selected-in-order';
import { SelectContext } from '@/components/documents/journalfoerte-documents/select-context/select-context';
import { TabContext } from '@/components/documents/tab-context';
import { useIsTabOpen } from '@/components/documents/use-is-tab-open';
import { toast } from '@/components/toast/store';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useFilesViewed } from '@/hooks/settings/use-setting';
import { useDocumentTabUrl } from '@/hooks/use-document-tab-url';
import { useGetArkiverteDokumenterQuery } from '@/redux-api/oppgaver/queries/documents';

export const useViewCombinedPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { setArchivedFiles } = useFilesViewed();
  const { selectedDocuments } = useContext(SelectContext);
  const { data: archivedList, isLoading } = useGetArkiverteDokumenterQuery(useOppgaveId());
  const { getCombinedTabUrl, getCombinedTabId } = useDocumentTabUrl();

  const { toOpen, toDownload } = useMemo(
    () =>
      archivedList === undefined
        ? { toOpen: [], toDownload: [] }
        : getSelectedDocumentsInOrder(selectedDocuments, archivedList.dokumenter),
    [archivedList, selectedDocuments],
  );

  const documentId = useMemo(
    () => (toOpen.length === 0 ? undefined : getCombinedTabId(toOpen)),
    [toOpen, getCombinedTabId],
  );

  const isTabOpen = useIsTabOpen(documentId);

  const onSelect = useCallback(() => {
    if (toDownload.length > 0) {
      showDownloadDocumentsToast(...toDownload);
    }

    setArchivedFiles(toOpen);
  }, [toDownload, toOpen, setArchivedFiles]);

  const onSelectNewTab = useCallback(() => {
    if (toDownload.length > 0) {
      showDownloadDocumentsToast(...toDownload);
    }

    if (documentId === undefined) {
      toast.error('Kunne ikke generere kombinert dokument');

      return;
    }

    const tabRef = getTabRef(documentId);

    if (tabRef !== undefined && !tabRef.closed) {
      tabRef.focus();

      return;
    }

    if (isTabOpen) {
      toast.warning('Dokumentet er allerede åpent i en annen fane');

      return;
    }

    const tabUrl = getCombinedTabUrl(toOpen);

    const newTabRef = window.open(tabUrl, documentId);

    if (newTabRef === null) {
      toast.error('Kunne ikke åpne ny fane');

      return;
    }

    setTabRef(documentId, newTabRef);
  }, [toDownload, documentId, isTabOpen, getTabRef, setTabRef, getCombinedTabUrl, toOpen]);

  return { onSelect, onSelectNewTab, isLoading };
};
