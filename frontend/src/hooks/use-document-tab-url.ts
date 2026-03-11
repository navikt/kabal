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
} from '@app/domain/tabbed-document-url';
import { useNewFileViewerFeatureToggle } from '@app/simple-api-state/feature-toggles';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useMemo } from 'react';

interface DocumentTabUrlFunctions {
  getNewTabUrl: (oppgaveId: string, documentId: string, parentId: string | null) => string;
  getJournalfoertTabUrl: (journalpostId: string, dokumentInfoId: string) => string;
  getCombinedTabUrl: (documents: readonly IJournalfoertDokumentId[]) => string;
  getCombinedTabId: (documents: readonly IJournalfoertDokumentId[]) => string;
  getAttachmentsOverviewUrl: (oppgaveId: string, documentId: string) => string;
}

const FILE_VIEWER_FUNCTIONS: DocumentTabUrlFunctions = {
  getNewTabUrl: getNewFileViewerTabUrl,
  getJournalfoertTabUrl: getJournalfoertFileViewerTabUrl,
  getCombinedTabUrl: getCombinedFileViewerTabUrl,
  getCombinedTabId: getCombinedFileViewerTabId,
  getAttachmentsOverviewUrl: getAttachmentsOverviewFileViewerTabUrl,
};

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
  const { data } = useNewFileViewerFeatureToggle();
  const useNewFileViewer = data?.enabled ?? false;

  return useMemo(() => (useNewFileViewer ? FILE_VIEWER_FUNCTIONS : DOCUMENT_FUNCTIONS), [useNewFileViewer]);
};
