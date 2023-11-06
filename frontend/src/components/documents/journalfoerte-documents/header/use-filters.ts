import { useCallback, useMemo, useState } from 'react';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import {
  useDocumentsAvsenderMottaker,
  useDocumentsFilterDato,
  useDocumentsFilterSaksId,
  useDocumentsFilterTema,
  useDocumentsFilterType,
  useDocumentsOnlyIncluded,
} from '@app/hooks/settings/use-setting';
import { IArkivertDocument, Journalposttype } from '@app/types/arkiverte-documents';
import { useFilteredDocuments } from './filter-helpers';

const EMPTY_FILTER: string[] = [];
const EMPTY_TYPE_FILTER: Journalposttype[] = [];

export const useFilters = (documents: IArkivertDocument[]) => {
  const [isExpanded] = useIsExpanded();

  const [search, setSearch] = useState('');
  const resetTitle = useCallback(() => setSearch(''), [setSearch]);

  const {
    value: selectedTypes = EMPTY_TYPE_FILTER,
    setValue: setSelectedTypes,
    remove: resetTypes,
  } = useDocumentsFilterType();
  const { value: selectedDateRange, remove: resetDateRange } = useDocumentsFilterDato();
  const { value: onlyIncluded = false, setValue: setIncluded } = useDocumentsOnlyIncluded();

  const {
    value: selectedTemaer = EMPTY_FILTER,
    setValue: setSelectedTemaer,
    remove: resetTemaer,
  } = useDocumentsFilterTema();

  const {
    value: selectedAvsenderMottakere = EMPTY_FILTER,
    setValue: setSelectedAvsenderMottakere,
    remove: resetAvsenderMottakere,
  } = useDocumentsAvsenderMottaker();

  const {
    value: selectedSaksIds = EMPTY_FILTER,
    setValue: setSelectedSaksIds,
    remove: resetSaksId,
  } = useDocumentsFilterSaksId();

  const totalFilteredDocuments = useFilteredDocuments(
    documents,
    selectedAvsenderMottakere,
    selectedDateRange,
    selectedSaksIds,
    selectedTemaer,
    selectedTypes,
    onlyIncluded,
    search,
  );

  const resetFilters = useCallback(() => {
    resetTitle();
    resetTemaer();
    resetTypes();
    resetAvsenderMottakere();
    resetSaksId();
    resetDateRange();
    setIncluded(!isExpanded);
  }, [
    isExpanded,
    resetAvsenderMottakere,
    resetDateRange,
    resetSaksId,
    resetTemaer,
    resetTitle,
    resetTypes,
    setIncluded,
  ]);

  const noFiltersActive = useMemo(
    () =>
      selectedTemaer.length === 0 &&
      selectedTypes.length === 0 &&
      selectedAvsenderMottakere.length === 0 &&
      selectedSaksIds.length === 0 &&
      selectedDateRange === undefined &&
      (isExpanded ? onlyIncluded === false : onlyIncluded === true) &&
      search === '',
    [
      onlyIncluded,
      isExpanded,
      search,
      selectedAvsenderMottakere.length,
      selectedDateRange,
      selectedSaksIds.length,
      selectedTemaer.length,
      selectedTypes.length,
    ],
  );

  return {
    resetFilters,
    noFiltersActive,
    totalFilteredDocuments,
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    selectedDateRange,
    selectedTemaer,
    setSelectedTemaer,
    selectedAvsenderMottakere,
    setSelectedAvsenderMottakere,
    selectedSaksIds,
    setSelectedSaksIds,
  };
};
