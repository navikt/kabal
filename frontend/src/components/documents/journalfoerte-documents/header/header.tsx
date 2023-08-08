import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import {
  Fields,
  collapsedJournalfoerteDocumentsHeaderGridCSS,
  expandedJournalfoerteDocumentsHeaderGridCSS,
} from '@app/components/documents/journalfoerte-documents/grid';
import { DocumentSearch } from '@app/components/documents/journalfoerte-documents/header/document-search';
import { IncludedFilter } from '@app/components/documents/journalfoerte-documents/header/included-filter';
import { SelectAll } from '@app/components/documents/journalfoerte-documents/header/select-all';
import { listHeaderCSS } from '@app/components/documents/styled-components/list-header';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { AvsenderMottaker, Journalposttype, Sak } from '@app/types/arkiverte-documents';
import { IJournalpostReference } from '@app/types/documents/documents';
import { DateFilter } from './date-filter';
import { useFilters } from './use-filters';

interface Props {
  filters: ReturnType<typeof useFilters>;
  slicedFilteredDocuments: IJournalpostReference[];
  avsenderMottakerList: AvsenderMottaker[];
  sakList: Sak[];
}

export const Header = ({ slicedFilteredDocuments, filters, sakList, avsenderMottakerList }: Props) => {
  const [isExpanded] = useIsExpanded();

  const { setSearch, search } = filters;

  return (
    <StyledListHeader $isExpanded={isExpanded}>
      <SelectAll slicedFilteredDocuments={slicedFilteredDocuments} />
      <DocumentSearch setSearch={setSearch} search={search} />

      {isExpanded ? (
        <ExpandedHeaders {...filters} avsenderMottakerList={avsenderMottakerList} saksIdList={sakList} />
      ) : null}

      <IncludedFilter />
    </StyledListHeader>
  );
};

interface IExpandedHeaderProps extends ReturnType<typeof useFilters> {
  avsenderMottakerList: AvsenderMottaker[];
  saksIdList: Sak[];
}

const ExpandedHeaders = ({
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
  avsenderMottakerList,
  saksIdList,
}: IExpandedHeaderProps) => {
  const avsenderMottakerOptions = useMemo(
    () => avsenderMottakerList.map(({ navn, id }) => ({ label: navn ?? 'Ukjent', value: id ?? 'UNKNOWN' })),
    [avsenderMottakerList],
  );
  const saksIdOptions = useMemo(
    () => saksIdList.map(({ fagsakId }) => ({ label: fagsakId ?? 'Ukjent', value: fagsakId ?? 'UNKNOWN' })),
    [saksIdList],
  );
  const allTemaer = useAllTemaer();

  return (
    <>
      <StyledFilterDropdown
        options={kodeverkValuesToDropdownOptions(allTemaer)}
        onChange={setSelectedTemaer}
        selected={selectedTemaer}
        $area={Fields.Tema}
        data-testid="filter-tema"
      >
        Tema
      </StyledFilterDropdown>

      <DateFilter />

      <StyledFilterDropdown
        options={avsenderMottakerOptions}
        onChange={setSelectedAvsenderMottakere}
        selected={selectedAvsenderMottakere}
        direction="left"
        $area={Fields.AvsenderMottaker}
        data-testid="filter-avsender-mottaker"
      >
        Avsender/mottaker
      </StyledFilterDropdown>

      <StyledFilterDropdown
        options={saksIdOptions}
        onChange={setSelectedSaksIds}
        selected={selectedSaksIds}
        direction="left"
        $area={Fields.SaksId}
        data-testid="filter-saks-id"
      >
        Saks-ID
      </StyledFilterDropdown>

      <StyledFilterDropdown
        options={JOURNALPOSTTYPE_OPTIONS}
        onChange={(types) => setSelectedTypes(types.filter(isJournalpostType))}
        selected={selectedTypes}
        direction="left"
        $area={Fields.Type}
        data-testid="filter-type"
      >
        Type
      </StyledFilterDropdown>
    </>
  );
};

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

const StyledListHeader = styled.div<{ $isExpanded: boolean }>`
  ${listHeaderCSS}
  ${({ $isExpanded }) =>
    $isExpanded ? expandedJournalfoerteDocumentsHeaderGridCSS : collapsedJournalfoerteDocumentsHeaderGridCSS}
`;

const StyledFilterDropdown = styled(FilterDropdown)<{ $area: Fields }>`
  grid-area: ${({ $area }) => $area};
`;

const isJournalpostType = (type: Journalposttype | string): type is Journalposttype =>
  Object.values(Journalposttype).some((value) => value === type);
