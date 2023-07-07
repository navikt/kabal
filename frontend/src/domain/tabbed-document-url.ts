export const getNewDocumentTabUrl = (oppgaveId: string, documentId: string) =>
  `/nytt-dokument/${oppgaveId}/${documentId}`;

export const getJournalfoertDocumentTabUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/arkivert-dokument/${journalpostId}/${dokumentInfoId}`;

export const getMergedDocumentTabUrl = (mergedDocumentId: string) => `/kombinert-dokument/${mergedDocumentId}`;

export const getNewDocumentTabId = (documentId: string) => `new-document-${documentId}`;

export const getJournalfoertDocumentTabId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

export const getMergedDocumentTabId = (mergedDocumentId: string) => `combined-document-${mergedDocumentId}`;
