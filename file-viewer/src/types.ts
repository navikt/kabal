import type { FileEntry } from '@navikt/klage-file-viewer';

/** Metadata embedded by the server into the HTML template as JSON. */
export interface DocumentViewerMetadata {
  /** The authenticated user's NAV ident, used for theme preferences in localStorage. */
  navIdent: string;
  /** List of files to render in the file viewer. */
  files: FileEntry[];
}
