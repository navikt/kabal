export const getNewDocumentTabUrl = (oppgaveId: string, documentId: string, _parentId: string | null) =>
  `/file-viewer/dua/${oppgaveId}/${documentId}`;

export const getJournalfoertDocumentTabUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/file-viewer/archived/${journalpostId}:${dokumentInfoId}`;

export const getMergedDocumentTabUrl = (mergedDocumentId: string) => `/kombinert-dokument/${mergedDocumentId}`;

export const getNewDocumentTabId = (documentId: string, parentId: string | null) =>
  parentId === null ? `new-document-${documentId}` : `new-document-attachment-${documentId}`;

export const getJournalfoertDocumentTabId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

export const getMergedDocumentTabId = (mergedDocumentId: string) => `combined-document-${mergedDocumentId}`;

export const getAttachmentsOverviewTabUrl = (oppgaveId: string, documentId: string) =>
  `/file-viewer/dua/${oppgaveId}/${documentId}/vedleggsoversikt`;

export const getAttachmentsOverviewTabId = (documentId: string) => `attachments-overview-${documentId}`;
