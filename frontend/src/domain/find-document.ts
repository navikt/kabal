import { IArkivertDocument } from '@app/types/arkiverte-documents';

export const findDocument = (dokumentInfoId: string, documents: IArkivertDocument[]): IArkivertDocument | undefined => {
  for (const document of documents) {
    if (document.dokumentInfoId === dokumentInfoId) {
      return document;
    }

    for (const v of document.vedlegg) {
      if (v.dokumentInfoId === dokumentInfoId) {
        return { ...document, ...v };
      }
    }
  }
};
