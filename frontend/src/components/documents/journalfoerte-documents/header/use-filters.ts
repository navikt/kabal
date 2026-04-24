import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFilteredDocuments } from '@/components/documents/journalfoerte-documents/header/filter-helpers';
import { useShowVedlegg } from '@/components/documents/journalfoerte-documents/state/show-vedlegg';
import { useIsExpanded } from '@/components/documents/use-is-expanded';
import { ArchivedDocumentsColumn } from '@/hooks/settings/use-archived-documents-setting';
import {
  type ArchivedDocumentsSort,
  useDocumentsAvsenderMottaker,
  useDocumentsFilterDatoOpprettet,
  useDocumentsFilterDatoSortering,
  useDocumentsFilterSaksId,
  useDocumentsFilterTema,
  useDocumentsFilterType,
  useDocumentsOnlyIncluded,
  useDocumentsSort,
} from '@/hooks/settings/use-setting';
import type { IArkivertDocument, Journalposttype } from '@/types/arkiverte-documents';
import { SortOrder } from '@/types/sort';
import { setAccessibleToRealDocumentPaths } from '../keyboard/helpers/set-accessible-to-real-document-paths';

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
  const { value: selectedDatoOpprettet, remove: resetDatoOpprettet } = useDocumentsFilterDatoOpprettet();
  const { value: selectedDatoRegSendt, remove: resetDatoRegSendt } = useDocumentsFilterDatoSortering();
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
    selectedDatoOpprettet,
    selectedDatoRegSendt,
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
    resetDatoOpprettet();
    resetDatoRegSendt();
    setIncluded(!isExpanded);
  }, [
    isExpanded,
    resetAvsenderMottakere,
    resetDatoOpprettet,
    resetDatoRegSendt,
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
      selectedDatoOpprettet === undefined &&
      (isExpanded ? onlyIncluded === false : onlyIncluded === true) &&
      search === '',
    [
      onlyIncluded,
      isExpanded,
      search,
      selectedAvsenderMottakere.length,
      selectedDatoOpprettet,
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
    selectedDatoOpprettet,
    selectedDatoRegSendt,
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
