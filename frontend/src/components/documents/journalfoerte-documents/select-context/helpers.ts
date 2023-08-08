import { ISelectedDocument } from '@app/components/documents/journalfoerte-documents/select-context/types';
import { IJournalpostReference } from '@app/types/documents/documents';

export const getId = (document: ISelectedDocument) => `${document.journalpostId}:${document.dokumentInfoId}`;

export const matchDocuments = (document: ISelectedDocument, otherDocument: ISelectedDocument) =>
  document.journalpostId === otherDocument.journalpostId && document.dokumentInfoId === otherDocument.dokumentInfoId;

// Find the path to the document or vedlegg in the document list.
export const getDocumentPath = (
  documentList: IJournalpostReference[],
  document: ISelectedDocument,
): [number, number] => {
  for (let i = documentList.length - 1; i >= 0; i--) {
    const doc = documentList[i];

    if (doc === undefined) {
      return [-1, -1];
    }

    if (doc.journalpostId === document.journalpostId) {
      if (doc.dokumentInfoId === document.dokumentInfoId) {
        return [i, -1];
      }

      if (doc.vedlegg.length !== 0) {
        const vedleggIndex = doc.vedlegg.findIndex((vedlegg) => vedlegg === document.dokumentInfoId);

        if (vedleggIndex !== -1) {
          return [i, vedleggIndex];
        }
      }
    }
  }

  return [-1, -1];
};

export const getFirstPath = (pathA: [number, number], pathB: [number, number]) => {
  if (pathA[0] < pathB[0]) {
    return pathA;
  }

  if (pathA[0] > pathB[0]) {
    return pathB;
  }

  if (pathA[1] < pathB[1]) {
    return pathA;
  }

  return pathB;
};
