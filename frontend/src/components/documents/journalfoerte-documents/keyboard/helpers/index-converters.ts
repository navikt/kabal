import { getLastIndex } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getAccessibleDocumentIndex,
  getFocusedVedleggIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import type { DocumentPath } from '@app/components/documents/journalfoerte-documents/select-context/types';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';

let state: number[] = [];

export const getFirstAccessibleDocumentIndex = () => (state.length > 0 ? 0 : -1);

export const getLastAccessibleDocumentIndex = () => getLastIndex(state);

export const convertAccessibleToRealDocumentIndex = (i: number): number => (i === -1 ? -1 : (state[i] ?? -1));

export const convertRealToAccessibleDocumentIndex = (i: number): number | null =>
  state.includes(i) ? state.indexOf(i) : null;

export const getDocumentPath = (d = getAccessibleDocumentIndex(), v = getFocusedVedleggIndex()): DocumentPath => [
  convertAccessibleToRealDocumentIndex(d),
  v,
];

export const setAccessibleToRealDocumentIndexes = (documents: IArkivertDocument[]) => {
  state = getIndexes(documents);
};

const getIndexes = (documents: IArkivertDocument[]) =>
  documents.reduce<number[]>((indexes, d, i) => {
    if (d.hasAccess) {
      indexes.push(i);
    }

    return indexes;
  }, []);
