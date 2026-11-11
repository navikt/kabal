import { useMemo } from 'react';
import {
  getAttachmentsOverviewFileViewerTabUrl,
  getAttachmentsOverviewTabUrl,
  getCombinedFileViewerTabId,
  getCombinedFileViewerTabUrl,
  getJournalfoertDocumentTabUrl,
  getJournalfoertFileViewerTabUrl,
  getMergedDocumentTabId,
  getMergedDocumentTabUrl,
  getNewDocumentTabUrl,
  getNewFileViewerTabUrl,
} from '@/domain/tabbed-document-url';
import { useMaybeOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useShowNewFileViewerFeatureToggle } from '@/simple-api-state/feature-toggles';
import type { IJournalfoertDokumentId } from '@/types/oppgave-common';

interface DocumentTabUrlFunctions {
  getNewTabUrl: (oppgaveId: string, documentId: string, parentId: string | null) => string;
  getJournalfoertTabUrl: (journalpostId: string, dokumentInfoId: string) => string;
  getCombinedTabUrl: (documents: readonly IJournalfoertDokumentId[]) => string;
  getCombinedTabId: (documents: readonly IJournalfoertDokumentId[]) => string;
  getAttachmentsOverviewUrl: (oppgaveId: string, documentId: string) => string;
}

const getFileViewerFunctions = (behandlingId: string): DocumentTabUrlFunctions => ({
  getNewTabUrl: getNewFileViewerTabUrl,
  getJournalfoertTabUrl: (journalpostId, dokumentInfoId) =>
    getJournalfoertFileViewerTabUrl(behandlingId, journalpostId, dokumentInfoId),
  getCombinedTabUrl: (documents) => getCombinedFileViewerTabUrl(behandlingId, documents),
  getCombinedTabId: getCombinedFileViewerTabId,
  getAttachmentsOverviewUrl: getAttachmentsOverviewFileViewerTabUrl,
});

const DOCUMENT_FUNCTIONS: DocumentTabUrlFunctions = {
  getNewTabUrl: getNewDocumentTabUrl,
  getJournalfoertTabUrl: getJournalfoertDocumentTabUrl,
  getCombinedTabUrl: (documents) =>
    getMergedDocumentTabUrl(documents.map((d) => `${d.journalpostId}:${d.dokumentInfoId}`).join(',')),
  getCombinedTabId: (documents) =>
    getMergedDocumentTabId(documents.map((d) => `${d.journalpostId}:${d.dokumentInfoId}`).join(',')),
  getAttachmentsOverviewUrl: getAttachmentsOverviewTabUrl,
};

export const useDocumentTabUrl = (): DocumentTabUrlFunctions => {
  const { data } = useShowNewFileViewerFeatureToggle();
  const showNewFileViewer = data?.enabled ?? false;
  const behandlingId = useMaybeOppgaveId();

  return useMemo(
    // The new file viewer is tied to a behandling. Documents are only listed in a behandling, so the fallback is a safeguard.
    () => (showNewFileViewer && behandlingId !== null ? getFileViewerFunctions(behandlingId) : DOCUMENT_FUNCTIONS),
    [showNewFileViewer, behandlingId],
  );
};
