import type { IArkivertDocument } from '@app/types/arkiverte-documents';

export const findDocument = (
  journalpostId: string,
  dokumentInfoId: string,
  documents: IArkivertDocument[],
): IArkivertDocument | undefined => {
  for (const document of documents) {
    // Must be the same journalpost.
    if (document.journalpostId !== journalpostId) {
      continue;
    }

    // If it is the main document, return it.
    if (document.dokumentInfoId === dokumentInfoId) {
      return document;
    }

    // Look for a matching vedlegg.
    for (const v of document.vedlegg) {
      if (v.dokumentInfoId === dokumentInfoId) {
        return { ...document, ...v };
      }
    }
  }
};
