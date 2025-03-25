import { useSelectMany } from '@app/components/documents/journalfoerte-documents/select-context/select-many';
import type {
  DocumentPath,
  SelectRangeHook,
} from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useCallback } from 'react';

export const useSelectRange: SelectRangeHook = (setSelectedDocuments, setLastSelectedDocument, documentList) => {
  const selectMany = useSelectMany(setSelectedDocuments, setLastSelectedDocument, documentList);

  return useCallback(
    (from, to) => {
      const isBackwards = from[0] > to[0] || (from[0] === to[0] && from[1] > to[1]);
      selectMany(isBackwards ? backwards(from, to, documentList) : forwards(from, to, documentList));
    },
    [documentList, selectMany],
  );
};

type Fn = (
  [fromDoc, fromVedlegg]: DocumentPath,
  [toDoc, toVedlegg]: DocumentPath,
  documentList: IArkivertDocument[],
) => IJournalfoertDokumentId[];

const forwards: Fn = (from, to, documentList) => {
  const [fromDoc, fromVedlegg] = from;
  const [toDoc] = to;

  const selectedDocuments = documentList
    .filter((_, i) => ((fromVedlegg === -1 && i >= fromDoc) || i > fromDoc) && i <= toDoc)
    .map(({ journalpostId, dokumentInfoId }) => ({ journalpostId, dokumentInfoId }));

  return [...selectedDocuments, ...getSelectedVedlegg(from, to, documentList)];
};

const backwards: Fn = (from, to, documentList) => {
  const [fromDoc] = from;
  const [toDoc, toVedlegg] = to;

  const selectedDocuments = documentList
    .filter((_, i) => ((toVedlegg === -1 && i >= toDoc) || i > toDoc) && i <= fromDoc)
    .map(({ journalpostId, dokumentInfoId }) => ({ journalpostId, dokumentInfoId }));

  return [...selectedDocuments, ...getSelectedVedlegg(to, from, documentList)];
};

const getSelectedVedlegg: Fn = ([startDoc, startVedlegg], [endDoc, endVedlegg], documentList) => {
  const documentsWithRelevantVedlegg = documentList.slice(startDoc, endDoc + 1);

  const lastDocumentIndex = documentsWithRelevantVedlegg.length - 1;

  return documentsWithRelevantVedlegg.flatMap(({ journalpostId, vedlegg }, i) => {
    // If it is the only document.
    if (i === 0 && startDoc === endDoc) {
      return vedleggToSelected(journalpostId, vedlegg, startVedlegg, endVedlegg);
    }

    // If it is the first document. Select all vedlegg from the start vedlegg.
    if (i === 0) {
      return vedleggToSelected(journalpostId, vedlegg, startVedlegg, vedlegg.length - 1);
    }

    // If it is the last document. Select all vedlegg to the end vedlegg.
    if (i === lastDocumentIndex) {
      return vedleggToSelected(journalpostId, vedlegg, 0, endVedlegg);
    }

    // If it is a middle document. Select all vedlegg.
    return vedlegg.map((v) => ({ journalpostId, dokumentInfoId: v.dokumentInfoId }));
  });
};

const vedleggToSelected = (
  journalpostId: string,
  vedlegg: IArkivertDocumentVedlegg[],
  start: number,
  end: number,
): IJournalfoertDokumentId[] =>
  vedlegg
    .slice(Math.max(start, 0), Math.min(end + 1, vedlegg.length))
    .map((v) => ({ journalpostId, dokumentInfoId: v.dokumentInfoId }));
