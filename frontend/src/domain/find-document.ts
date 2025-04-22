import type { IArkivertDocument } from '@app/types/arkiverte-documents';

export const findDocument = (
  journalpostId: string,
  dokumentInfoId: string,
  documents: IArkivertDocument[],
): IArkivertDocument | undefined => {
  for (const document of documents) {
    if (document.journalpostId === journalpostId && document.dokumentInfoId === dokumentInfoId) {
      return document;
    }

    if (document.journalpostId !== journalpostId) {
      continue;
    }

    for (const v of document.vedlegg) {
      if (v.dokumentInfoId === dokumentInfoId) {
        return { ...document, ...v };
      }
    }
  }
};
