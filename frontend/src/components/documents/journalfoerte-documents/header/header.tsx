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
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { IArkivertDocumentReference } from '../select-context/types';
import { DateFilter } from './date-filter';
import { useFilters } from './use-filters';

interface Props {
  filters: ReturnType<typeof useFilters>;
  allSelectableDocuments: IArkivertDocumentReference[];
}

export const Header = ({ allSelectableDocuments, filters }: Props) => {
  const [isExpanded] = useIsExpanded();

  const { setSearch, search } = filters;

  return (
    <StyledListHeader $isExpanded={isExpanded}>
      <SelectAll allSelectableDocuments={allSelectableDocuments} />
      <DocumentSearch setSearch={setSearch} search={search} />

      {isExpanded ? <ExpandedHeaders {...filters} /> : null}

      <IncludedFilter />
    </StyledListHeader>
  );
};

const ExpandedHeaders = ({
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
}: ReturnType<typeof useFilters>) => {
  const oppgaveId = useOppgaveId();
  const { data } = useGetArkiverteDokumenterQuery(oppgaveId);

  const avsenderMottakerOptions = useMemo(
    () =>
      (data?.avsenderMottakerList ?? []).map(({ id, navn }) => ({ label: navn ?? 'Ukjent', value: id ?? 'UNKNOWN' })),
    [data],
  );

  const saksIdOptions = useMemo(
    () => (data?.sakList ?? []).map(({ fagsakId }) => ({ label: fagsakId, value: fagsakId })),
    [data],
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
        $area={Fields.Saksnummer}
        data-testid="filter-saksnummer"
      >
        Saksnummer
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
