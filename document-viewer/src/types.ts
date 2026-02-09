/** Metadata for a single document to display in the viewer. */
export interface DocumentEntry {
  /** Human-readable title of the document. */
  title: string;
  /** URL to fetch the PDF content from (e.g. `/api/kabal-api/...`). */
  url: string;
}

/** Metadata embedded by the server into the HTML template as JSON. */
export interface DocumentViewerMetadata {
  /** The authenticated user's NAV ident, used for theme preferences in localStorage. */
  navIdent: string;
  /** List of documents to render in the PDF viewer. */
  documents: DocumentEntry[];
}
