import { getLastIndex } from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import {
  getSelectionRanges,
  setSelectionRanges,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import {
  indexesToRanges,
  rangesToIndexes,
} from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import { Observable } from '@app/observable';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';

type Path = readonly [number, number];

type PathList = readonly Path[];

interface Document {
  readonly path: Path;
  readonly journalpostId: string;
  readonly dokumentInfoId: string;
}

export type DocumentIndexesState = readonly Document[];

const INITIAL_STATE: DocumentIndexesState = Object.freeze([]);

const state = new Observable<DocumentIndexesState>(INITIAL_STATE);

export const FIRST_ACCESSIBLE_DOCUMENT_INDEX = 0;

export const getLastAccessibleDocumentIndex = () => getLastIndex(state.get());

export const convertAccessibleToRealDocumentPath = (i: number): Path | null =>
  i === -1 ? null : (state.get()[i]?.path ?? null);

export const convertAccessibleToRealDocumentPaths = (indexes: readonly number[]): PathList => {
  const paths: Path[] = [];

  for (const i of indexes) {
    const path = convertAccessibleToRealDocumentPath(i);

    if (path !== null) {
      paths.push(path);
    }
  }

  return Object.freeze(paths);
};

export const convertRealToAccessibleDocumentIndex = (real: Path): number | undefined => {
  const index = state.get().findIndex(({ path: [d, a] }) => d === real[0] && a === real[1]);
  return index === -1 ? undefined : index;
};

export const convertAccessibleIndexToDocumentLocation = (accessibleIndex: number): Document | null =>
  state.get()[accessibleIndex] ?? null;

export const setAccessibleToRealDocumentPaths = (
  filteredDocuments: readonly IArkivertDocument[],
  showVedleggIdList: readonly string[],
) => {
  const nextState = getNextState(filteredDocuments, showVedleggIdList);
  const ranges = getSelectionRanges();

  const nextIndexes: number[] = [];

  for (const previousIndex of rangesToIndexes(ranges)) {
    const location = convertAccessibleIndexToDocumentLocation(previousIndex);

    if (location === null) {
      continue;
    }

    const index = nextState.findIndex(
      (d) => d.journalpostId === location.journalpostId && d.dokumentInfoId === location.dokumentInfoId,
    );

    if (index !== -1) {
      nextIndexes.push(index);
    }
  }

  state.set(nextState);

  setSelectionRanges(indexesToRanges(nextIndexes));
};

const getNextState = (
  filteredDocuments: readonly IArkivertDocument[],
  showVedleggIdList: readonly string[],
): Readonly<DocumentIndexesState> => {
  const result: Document[] = [];

  filteredDocuments.forEach((d, i) => {
    if (d.hasAccess) {
      result.push({ path: [i, -1], journalpostId: d.journalpostId, dokumentInfoId: d.dokumentInfoId });
    }

    if (!showVedleggIdList.includes(d.journalpostId)) {
      return;
    }

    d.vedlegg.forEach((a, j) => {
      if (a.hasAccess) {
        result.push({ path: [i, j], journalpostId: d.journalpostId, dokumentInfoId: a.dokumentInfoId });
      }
    });
  });

  return Object.freeze(result);
};
