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
import { IArkivertDocument, Journalposttype } from '@app/types/arkiverte-documents';
import { DateFilter } from './date-filter';
import { getAvsenderMottakerOptions, getSaksIdOptions } from './filter-helpers';
import { useFilters } from './use-filters';

interface Props {
  filters: ReturnType<typeof useFilters>;
  documents: IArkivertDocument[];
  slicedFilteredDocuments: IArkivertDocument[];
}

export const Header = ({ documents, slicedFilteredDocuments, filters }: Props) => {
  const [isExpanded] = useIsExpanded();

  const { setSearch, search } = filters;

  return (
    <StyledListHeader $isExpanded={isExpanded}>
      <SelectAll slicedFilteredDocuments={slicedFilteredDocuments} />
      <DocumentSearch setSearch={setSearch} search={search} />

      {isExpanded ? <ExpandedHeaders {...filters} documents={documents} /> : null}

      <IncludedFilter />
    </StyledListHeader>
  );
};

interface IExpandedHeaderProps extends ReturnType<typeof useFilters> {
  documents: IArkivertDocument[];
}

const ExpandedHeaders = ({
  documents,
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
}: IExpandedHeaderProps) => {
  const avsenderMottakerOptions = useMemo(() => getAvsenderMottakerOptions(documents), [documents]);
  const saksIdOptions = useMemo(() => getSaksIdOptions(documents), [documents]);
  const allTemaer = useAllTemaer();

  return (
    <>
      <StyledFilterDropdown
        options={kodeverkValuesToDropdownOptions(allTemaer)}
        onChange={setSelectedTemaer}
        selected={selectedTemaer}
        $area={Fields.Tema}
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
      >
        Avsender/mottaker
      </StyledFilterDropdown>

      <StyledFilterDropdown
        options={saksIdOptions}
        onChange={setSelectedSaksIds}
        selected={selectedSaksIds}
        direction="left"
        $area={Fields.SaksId}
      >
        Saks-ID
      </StyledFilterDropdown>

      <StyledFilterDropdown
        options={JOURNALPOSTTYPE_OPTIONS}
        onChange={(types) => setSelectedTypes(types.filter(isJournalpostType))}
        selected={selectedTypes}
        direction="left"
        $area={Fields.Type}
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
