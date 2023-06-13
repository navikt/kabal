import { useCallback, useMemo } from 'react';
import {
  useDocumentsAvsenderMottaker,
  useDocumentsFilterDato,
  useDocumentsFilterIncluded,
  useDocumentsFilterSaksId,
  useDocumentsFilterTema,
  useDocumentsFilterTitle,
  useDocumentsFilterType,
} from '@app/hooks/settings/use-setting';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { IncludedDocumentFilter } from '@app/types/documents/documents';
import { useFilteredDocuments } from '../filter-helpers';

const EMPTY_FILTER: string[] = [];

export const useFilters = (documents: IArkivertDocument[]) => {
  const { value: search = '', setValue: setSearch, remove: resetTitle } = useDocumentsFilterTitle();
  const { value: selectedTypes = [], setValue: setSelectedTypes, remove: resetTypes } = useDocumentsFilterType();
  const { value: selectedDateRange, remove: resetDateRange } = useDocumentsFilterDato();
  const { value: included = IncludedDocumentFilter.ALL, remove: resetIncluded } = useDocumentsFilterIncluded();

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
    included,
    search
  );

  const resetFilters = useCallback(() => {
    resetTitle();
    resetTemaer();
    resetTypes();
    resetAvsenderMottakere();
    resetSaksId();
    resetDateRange();
    resetIncluded();
  }, [resetAvsenderMottakere, resetDateRange, resetIncluded, resetSaksId, resetTemaer, resetTitle, resetTypes]);

  const noFiltersActive = useMemo(
    () =>
      selectedTemaer.length === 0 &&
      selectedTypes.length === 0 &&
      selectedAvsenderMottakere.length === 0 &&
      selectedSaksIds.length === 0 &&
      selectedDateRange === undefined &&
      included === IncludedDocumentFilter.ALL &&
      search === '',
    [
      included,
      search,
      selectedAvsenderMottakere.length,
      selectedDateRange,
      selectedSaksIds.length,
      selectedTemaer.length,
      selectedTypes.length,
    ]
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
