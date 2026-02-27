import { getLogger } from '@app/logger';
import type { ArchivedApiVariants } from '@app/plugins/file-viewer/schemas';
import type { FileEntry, IJournalfoertDokumentId } from '@app/plugins/file-viewer/types';

const log = getLogger('file-viewer');

/** Separator between journalpost groups. */
const GROUP_SEPARATOR = ';';
/** Separator between a journalpostId and its dokumentInfoIds. */
const KEY_SEPARATOR = ':';
/** Separator between dokumentInfoIds within a single journalpost group. */
const VALUE_SEPARATOR = ',';

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
      log.warn({ msg: `Invalid encoded archived document ID: missing '${KEY_SEPARATOR}' separator`, data: { group } });
      continue;
    }

    const journalpostId = group.slice(0, separatorIndex);
    const dokumentInfoIds = group.slice(separatorIndex + 1).split(VALUE_SEPARATOR);

    for (const dokumentInfoId of dokumentInfoIds) {
      if (dokumentInfoId.length > 0) {
        result.push({ journalpostId, dokumentInfoId });
      } else {
        log.warn({ msg: 'Empty dokumentInfoId in encoded archived document ID', data: { group, journalpostId } });
      }
    }
  }

  return result;
};

export const normalizeVariants = (variants: ArchivedApiVariants): FileEntry['variants'] => {
  if (Array.isArray(variants) && variants.length === 1) {
    return variants[0];
  }

  return variants;
};
