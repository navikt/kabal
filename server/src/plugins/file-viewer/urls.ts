/** Build the proxy URL for an archived document's PDF. */
export const getArchivedPdfUrl = (journalpostId: string, dokumentInfoId: string): string =>
  `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;

/** Build the proxy URL for a DUA document's PDF. */
export const getDuaPdfUrl = (behandlingId: string, documentId: string): string =>
  `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/pdf`;

/** Build the proxy URL for a vedleggsoversikt PDF. */
export const getVedleggsoversiktPdfUrl = (behandlingId: string, documentId: string): string =>
  `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt/pdf`;
