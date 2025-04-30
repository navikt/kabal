import { down } from '@app/components/documents/journalfoerte-documents/keyboard/actions/down';
import { end, home } from '@app/components/documents/journalfoerte-documents/keyboard/actions/home-end';
import { up } from '@app/components/documents/journalfoerte-documents/keyboard/actions/up';
import { getLastAccessibleDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { getFocusIndex, setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import {
  addOne,
  getSelectionRanges,
  isSelected,
  selectAll,
  selectOne,
  selectRangeTo,
  unselectAll,
  unselectOne,
  useSelectionRangesState,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import {
  getRange,
  getRangeEnd,
  getRangeStart,
  getRangeStartAndEnd,
  isRangeCollapsed,
} from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useCallback, useContext } from 'react';

export const useToggleSelectAll = () => {
  const { selectedDocuments } = useContext(SelectContext);

  return useCallback(() => (selectedDocuments.size > 0 ? unselectAll() : selectAll()), [selectedDocuments.size]);
};

export const useAllSelected = (): boolean => {
  const [range] = useSelectionRangesState();

  if (range === undefined) {
    return false;
  }

  const [start, end] = getRangeStartAndEnd(range);

  return start === 0 && end === getLastAccessibleDocumentIndex();
};

export const toggleSelect = (focusedIndex = getFocusIndex()) => {
  isSelected(focusedIndex) ? unselectOne(focusedIndex) : selectOne(focusedIndex);
};

export const addOrRemoveOne = (focusedIndex = getFocusIndex()) => {
  isSelected(focusedIndex) ? unselectOne(focusedIndex) : addOne(focusedIndex);
};

export const selectDown = (focusedIndex = getFocusIndex(), ranges = getSelectionRanges()) => {
  const range = getRange(ranges, focusedIndex);

  if (range === undefined || isRangeCollapsed(range)) {
    selectRangeTo(down());
    return;
  }

  if (getRangeStart(range) === focusedIndex) {
    unselectOne(focusedIndex);
    setFocusIndex(down());
    return;
  }

  return selectRangeTo(down());
};

export const selectUp = (focusedIndex = getFocusIndex(), ranges = getSelectionRanges()) => {
  const range = getRange(ranges, focusedIndex);

  if (range === undefined || isRangeCollapsed(range)) {
    selectRangeTo(up());
    return;
  }

  if (getRangeEnd(range) === focusedIndex) {
    unselectOne(focusedIndex);
    setFocusIndex(up());
    return;
  }

  return selectRangeTo(up());
};

export const selectHome = (from = getFocusIndex()) => selectRangeTo(home(), from);

export const useSelectEnd = (filteredDocuments: IArkivertDocument[]) =>
  useCallback((from = getFocusIndex()) => selectRangeTo(end(filteredDocuments), from), [filteredDocuments]);
