export const getNewDocumentInlineUrl = (oppgaveId: string, documentId: string) =>
  `/api/kabal-api/behandlinger/${oppgaveId}/dokumenter/${documentId}/pdf`;

export const getJournalfoertDocumentInlineUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;

export const getMergedDocumentInlineUrl = (mergedDocumentId: string) =>
  `/api/kabal-api/journalposter/mergedocuments/${mergedDocumentId}/pdf`;
