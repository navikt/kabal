import type { IDocumentsPdfViewed } from '@app/components/view-pdf/types';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

/** Separator between journalpost groups. */
const GROUP_SEPARATOR = ';';
/** Separator between a journalpostId and its dokumentInfoIds. */
const KEY_SEPARATOR = ':';
/** Separator between dokumentInfoIds within a single journalpost group. */
const VALUE_SEPARATOR = ',';

/**
 * Encodes an array of archived document references into a compact path segment.
 * Documents are grouped by journalpostId to minimise URL length.
 *
 * Format: `jp1:doc1,doc2;jp2:doc3`
 * - `:` separates journalpostId from its dokumentInfoIds
 * - `,` separates multiple dokumentInfoIds within the same journalpost
 * - `;` separates different journalpost groups
 *
 * All three characters are RFC 3986 sub-delimiters, safe in URL path segments without percent-encoding.
 */
export const encodeArchivedDocumentIds = (docs: readonly IJournalfoertDokumentId[]): string => {
  const grouped = new Map<string, string[]>();

  for (const { journalpostId, dokumentInfoId } of docs) {
    const existing = grouped.get(journalpostId);

    if (existing === undefined) {
      grouped.set(journalpostId, [dokumentInfoId]);
    } else {
      existing.push(dokumentInfoId);
    }
  }

  const segments: string[] = [];

  for (const [journalpostId, dokumentInfoIds] of grouped) {
    segments.push(`${journalpostId}${KEY_SEPARATOR}${dokumentInfoIds.join(VALUE_SEPARATOR)}`);
  }

  return segments.join(GROUP_SEPARATOR);
};

/**
 * Decodes a compact path segment back into an array of archived document references.
 *
 * @see encodeArchivedDocumentIds for the encoding format.
 */
export const decodeArchivedDocumentIds = (encoded: string): IJournalfoertDokumentId[] => {
  if (encoded.length === 0) {
    return [];
  }

  const groups = encoded.split(GROUP_SEPARATOR);
  const result: IJournalfoertDokumentId[] = [];

  for (const group of groups) {
    const separatorIndex = group.indexOf(KEY_SEPARATOR);

    if (separatorIndex === -1) {
      continue;
    }

    const journalpostId = group.slice(0, separatorIndex);
    const dokumentInfoIds = group.slice(separatorIndex + 1).split(VALUE_SEPARATOR);

    for (const dokumentInfoId of dokumentInfoIds) {
      if (dokumentInfoId.length > 0) {
        result.push({ journalpostId, dokumentInfoId });
      }
    }
  }

  return result;
};

/**
 * Extracts the ID portion of a document-set for use as a tab/window identifier.
 *
 * - Archived documents → the encoded journalpost grouping, e.g. `jp1:doc1,doc2;jp2:doc3`
 * - Document in progress → the document UUID
 * - Attachment overview → `{id}/vedleggsoversikt`
 *
 * Returns `null` when the state represents an empty set (no documents to view).
 */
export const getDocumentSetId = (pdfViewed: IDocumentsPdfViewed): string | null => {
  if (pdfViewed.newDocument !== undefined) {
    return pdfViewed.newDocument;
  }

  if (pdfViewed.vedleggsoversikt !== undefined) {
    return `${pdfViewed.vedleggsoversikt}/vedleggsoversikt`;
  }

  if (pdfViewed.archivedDocuments.length === 0) {
    return null;
  }

  return encodeArchivedDocumentIds(pdfViewed.archivedDocuments);
};

const ARCHIVED_PREFIX = '/document-set/archived/';
const DUA_PREFIX = '/document-set/dua/';

/**
 * Generates a document-set URL for the current PDF viewer state.
 *
 * - Archived documents → `/document-set/archived/{encoded-ids}`
 * - Document in progress → `/document-set/dua/{id}`
 * - Attachment overview → `/document-set/dua/{id}/vedleggsoversikt`
 *
 * Returns `null` when the state represents an empty set (no documents to view).
 */
export const getDocumentSetUrl = (pdfViewed: IDocumentsPdfViewed): string | null => {
  const id = getDocumentSetId(pdfViewed);

  if (id === null) {
    return null;
  }

  if (pdfViewed.archivedDocuments !== undefined) {
    return `${ARCHIVED_PREFIX}${id}`;
  }

  return `${DUA_PREFIX}${id}`;
};
