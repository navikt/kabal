import {
  convertAccessibleIndexToDocumentLocation,
  getNextState,
  state,
} from '@/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  getSelectionRanges,
  setSelectionRanges,
} from '@/components/documents/journalfoerte-documents/keyboard/state/selection';
import {
  indexesToRanges,
  rangesToIndexes,
} from '@/components/documents/journalfoerte-documents/select-context/range-utils';
import type { IArkivertDocument } from '@/types/arkiverte-documents';

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
