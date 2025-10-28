import { useFilteredDocuments } from '@app/components/documents/journalfoerte-documents/header/filter-helpers';
import { setAccessibleToRealDocumentPaths } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { useShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import {
  type ArchivedDocumentsSort,
  useDocumentsAvsenderMottaker,
  useDocumentsFilterDatoOpprettet,
  useDocumentsFilterSaksId,
  useDocumentsFilterTema,
  useDocumentsFilterType,
  useDocumentsOnlyIncluded,
  useDocumentsSort,
} from '@app/hooks/settings/use-setting';
import type { IArkivertDocument, Journalposttype } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';
import { useCallback, useEffect, useMemo, useState } from 'react';

const EMPTY_FILTER: string[] = [];
const EMPTY_TYPE_FILTER: Journalposttype[] = [];
const DEFAULT_SORT: ArchivedDocumentsSort = { order: SortOrder.DESC, orderBy: ArchivedDocumentsColumn.DATO_OPPRETTET };

export const useFilters = (documents: IArkivertDocument[]) => {
  const [isExpanded] = useIsExpanded();

  const [search, setSearch] = useState('');
  const resetTitle = useCallback(() => setSearch(''), []);

  const {
    value: selectedTypes = EMPTY_TYPE_FILTER,
    setValue: setSelectedTypes,
    remove: resetTypes,
  } = useDocumentsFilterType();
  const { value: selectedDateRange, remove: resetDateRange } = useDocumentsFilterDatoOpprettet();
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

  const { value: sort = DEFAULT_SORT, setValue: setSort } = useDocumentsSort();

  const totalFilteredDocuments = useFilteredDocuments(
    documents,
    selectedAvsenderMottakere,
    selectedDateRange,
    selectedSaksIds,
    selectedTemaer,
    selectedTypes,
    onlyIncluded,
    search,
    sort,
  );

  const { value: showVedleggIdList } = useShowVedlegg();

  useEffect(() => {
    setAccessibleToRealDocumentPaths(totalFilteredDocuments, showVedleggIdList);
  }, [totalFilteredDocuments, showVedleggIdList]);

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
    sort,
    setSort,
  };
};
