export const getNewDocumentTabUrl = (oppgaveId: string, documentId: string, parentId: string | null) =>
  parentId === null ? `/nytt-dokument/${oppgaveId}/${documentId}` : `/nytt-dokumentvedlegg/${oppgaveId}/${documentId}`;

export const getJournalfoertDocumentTabUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/arkivert-dokument/${journalpostId}/${dokumentInfoId}`;

export const getMergedDocumentTabUrl = (mergedDocumentId: string) => `/kombinert-dokument/${mergedDocumentId}`;

export const getNewDocumentTabId = (documentId: string, parentId: string | null) =>
  parentId === null ? `new-document-${documentId}` : `new-document-attachment-${documentId}`;

export const getJournalfoertDocumentTabId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

export const getMergedDocumentTabId = (mergedDocumentId: string) => `combined-document-${mergedDocumentId}`;

export const getAttachmentsOverviewTabUrl = (oppgaveId: string, documentId: string) =>
  `/vedleggsoversikt/${oppgaveId}/${documentId}`;

export const getAttachmentsOverviewTabId = (documentId: string) => `attachments-overview-${documentId}`;
