/** Must match the server's highlights routes. */
const HIGHLIGHTS_PATH = '/highlights';

/** The `highlightsId` of a file in the file viewer. Highlights are personal, so the server adds the NAV-ident. */
export const getHighlightsId = (behandlingId: string, documentId: string): string => `${behandlingId}/${documentId}`;

/** Where a document variant's highlight changes are saved: `/highlights/{behandlingId}/{documentId}?format={format}`. */
export const getHighlightsUrl = ({ id, format }: { id: string; format: string | undefined }): string =>
  format === undefined ? `${HIGHLIGHTS_PATH}/${id}` : `${HIGHLIGHTS_PATH}/${id}?format=${format}`;

/** The user's highlight events in the behandling. */
export const getHighlightEventsUrl = (behandlingId: string): string => `${HIGHLIGHTS_PATH}/${behandlingId}/events`;
