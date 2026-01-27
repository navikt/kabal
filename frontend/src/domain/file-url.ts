export const getNewDocumentFileUrl = (oppgaveId: string, documentId: string) =>
  `/api/kabal-api/behandlinger/${oppgaveId}/dokumenter/${documentId}/pdf`;

export const getJournalfoertDocumentFileUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;

export const getMergedDocumentFileUrl = (mergedDocumentId: string) =>
  `/api/kabal-api/journalposter/mergedocuments/${mergedDocumentId}/pdf`;

export const getAttachmentsOverviewFileUrl = (oppgaveId: string, documentId: string) =>
  `/api/kabal-api/behandlinger/${oppgaveId}/dokumenter/${documentId}/vedleggsoversikt/pdf`;
