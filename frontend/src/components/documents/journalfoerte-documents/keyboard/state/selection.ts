import {
  FIRST_ACCESSIBLE_DOCUMENT_INDEX,
  convertAccessibleToRealDocumentPaths,
  convertRealToAccessibleDocumentIndex,
  getLastAccessibleDocumentIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  getFocusIndex,
  resetFocusIndex,
  setFocusIndex,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import {
  type SelectionRange,
  isInRange,
  mergeRanges,
  rangesToIndexes,
  removeIndexFromRanges,
} from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import type { SelectedMap } from '@app/components/documents/journalfoerte-documents/select-context/types';
import { findDocument } from '@app/domain/find-document';
import { isMetaKey } from '@app/keys';
import { Observable } from '@app/observable';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useSyncExternalStore } from 'react';

const INITIAL_STATE: SelectionRange[] = [];

const selectionRangesStore = new Observable<readonly SelectionRange[]>(INITIAL_STATE, mergeRanges);

export const useSelectionRangesState = () =>
  useSyncExternalStore(selectionRangesStore.subscribe, selectionRangesStore.get);

export const unselectAll = () => selectionRangesStore.set(INITIAL_STATE);
export const getSelectionRanges = () => selectionRangesStore.get();
export const setSelectionRanges: typeof selectionRangesStore.set = (selectionRanges) =>
  selectionRangesStore.set(selectionRanges);

export const selectOne = (accessibleDocumentIndex: number) => {
  selectionRangesStore.set([{ anchor: accessibleDocumentIndex, focus: accessibleDocumentIndex }]);
  return setFocusIndex(accessibleDocumentIndex);
};

export const addOne = (accessibleDocumentIndex: number) => {
  selectionRangesStore.set((prevRanges) => [
    ...prevRanges,
    { anchor: accessibleDocumentIndex, focus: accessibleDocumentIndex },
  ]);
  return setFocusIndex(accessibleDocumentIndex);
};

export const selectRangeTo = (toAccessibleDocumentIndex: number, from = getFocusIndex()) => {
  selectionRangesStore.set((prevRanges) => [
    ...prevRanges,
    { anchor: from, focus: Math.max(toAccessibleDocumentIndex, 0) },
  ]);
  return setFocusIndex(toAccessibleDocumentIndex);
};

interface ClickOrKeyEvent {
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
}

export const onSelectPath = (e: ClickOrKeyEvent, documentIndex: number, attachmentIndex = -1) => {
  const accessibleDocumentIndex = convertRealToAccessibleDocumentIndex([documentIndex, attachmentIndex]);

  if (accessibleDocumentIndex === undefined) {
    return;
  }

  if (isMetaKey(e)) {
    // Add or remove single document from selection.
    return isSelected(accessibleDocumentIndex) ? unselectOne(accessibleDocumentIndex) : addOne(accessibleDocumentIndex);
  }

  if (e.shiftKey) {
    // Select range of documents from focus to clicked document.
    return selectRangeTo(accessibleDocumentIndex);
  }

  // Set selection to single document.
  return setFocusIndex(accessibleDocumentIndex);
};

export const selectAll = () => {
  const lastAccessibleDocumentIndex = getLastAccessibleDocumentIndex();

  if (lastAccessibleDocumentIndex === FIRST_ACCESSIBLE_DOCUMENT_INDEX) {
    unselectAll();
    return resetFocusIndex();
  }

  selectionRangesStore.set([{ anchor: 0, focus: lastAccessibleDocumentIndex }]);
  return setFocusIndex(lastAccessibleDocumentIndex);
};

export const unselectOne = (accessibleDocumentIndex: number) => {
  selectionRangesStore.set((prevRanges) => removeIndexFromRanges(prevRanges, accessibleDocumentIndex));
};

export const isSelected = (accessibleIndex: number | undefined) => {
  if (accessibleIndex === undefined) {
    return false;
  }

  return getSelectionRanges().some((range) => isInRange(range, accessibleIndex));
};

export const isPathSelected = (document: number, attachment = -1) =>
  isSelected(convertRealToAccessibleDocumentIndex([document, attachment]));

export const useIsPathSelected = (document: number, attachment = -1) => {
  const ranges = useSelectionRangesState();
  const accessibleIndex = convertRealToAccessibleDocumentIndex([document, attachment]);

  if (accessibleIndex === undefined) {
    return false;
  }

  return ranges.some((range) => isInRange(range, accessibleIndex));
};

export const getSelectedDocumentsMap = (filteredDocumentsList: IArkivertDocument[]) => {
  const accessibleDocumentIndexes = rangesToIndexes(getSelectionRanges());
  const documentPaths = convertAccessibleToRealDocumentPaths(accessibleDocumentIndexes);

  return documentPaths.reduce<SelectedMap>((map, path) => {
    const [documentIndex, attachmentIndex] = path;
    const document = filteredDocumentsList[documentIndex];

    if (document === undefined) {
      return map;
    }

    if (attachmentIndex === -1) {
      const documentId: IJournalfoertDokumentId = {
        journalpostId: document.journalpostId,
        dokumentInfoId: document.dokumentInfoId,
      };

      map.set(getId(documentId), documentId);
    }

    const attachment = document.vedlegg[attachmentIndex];
    if (attachment === undefined) {
      return map;
    }

    const attachmentId: IJournalfoertDokumentId = {
      journalpostId: document.journalpostId,
      dokumentInfoId: attachment.dokumentInfoId,
    };

    map.set(getId(attachmentId), attachmentId);

    return map;
  }, new Map());
};

export const getSelectedDocuments = (filteredDocumentsList: IArkivertDocument[]) => {
  const selectedDocuments = getSelectedDocumentsMap(filteredDocumentsList);

  if (selectedDocuments.size === 0) {
    return [];
  }

  const selectedDocumentsArray: IArkivertDocument[] = new Array<IArkivertDocument>(selectedDocuments.size);

  let index = 0;
  for (const [, { journalpostId, dokumentInfoId }] of selectedDocuments) {
    const doc = findDocument(journalpostId, dokumentInfoId, filteredDocumentsList);

    if (doc !== undefined) {
      selectedDocumentsArray[index] = doc;
    }

    index++;
  }

  return selectedDocumentsArray;
};
