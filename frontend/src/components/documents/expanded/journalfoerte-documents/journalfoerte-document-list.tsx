import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { DocumentList } from '@app/components/documents/expanded/journalfoerte-documents/document-list';
import { DocumentSearch } from '@app/components/documents/expanded/journalfoerte-documents/document-search';
import { IncludedFilter } from '@app/components/documents/expanded/journalfoerte-documents/included-filter';
import { SelectAll } from '@app/components/documents/expanded/journalfoerte-documents/select-all';
import { SelectContextElement } from '@app/components/documents/expanded/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IArkivertDocument, Journalposttype } from '@app/types/arkiverte-documents';
import { kodeverkValuesToDropdownOptions } from '../../../filter-dropdown/functions';
import { StyledJournalfoerteDocumentsContainer } from '../styled-components/container';
import { Fields } from '../styled-components/grid';
import { JournalfoerteDocumentsStyledListHeader, StyledFilterDropdown } from '../styled-components/list-header';
import { DateFilter } from './date-filter';
import { getAvsenderMottakerOptions, getSaksIdOptions } from './filter-helpers';
import { Header } from './header/header';
import { useFilters } from './hooks/use-filters';
import { LoadMore } from './load-more';

const PAGE_SIZE = 50;
const EMPTY_ARRAY: IArkivertDocument[] = [];

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

export const JournalfoerteDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);
  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const {
    resetFilters,
    noFiltersActive,
    totalFilteredDocuments,
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    selectedTemaer,
    setSelectedTemaer,
    selectedAvsenderMottakere,
    setSelectedAvsenderMottakere,
    selectedSaksIds,
    setSelectedSaksIds,
  } = useFilters(documents);

  const [page, setPage] = useState(1);

  const avsenderMottakerOptions = useMemo(() => getAvsenderMottakerOptions(documents), [documents]);
  const saksIdOptions = useMemo(() => getSaksIdOptions(documents), [documents]);
  const allTemaer = useAllTemaer();

  const endIndex = PAGE_SIZE * page;

  const slicedFilteredDocuments = useMemo(
    () => totalFilteredDocuments.slice(0, endIndex),
    [endIndex, totalFilteredDocuments]
  );

  return (
    <SelectContextElement documentList={slicedFilteredDocuments}>
      <StyledJournalfoerteDocumentsContainer data-testid="oppgavebehandling-documents-all">
        <Header
          filteredLength={totalFilteredDocuments.length}
          totalLengthOfMainDocuments={data?.totaltAntall}
          noFiltersActive={noFiltersActive}
          resetFilters={resetFilters}
          slicedFilteredDocuments={slicedFilteredDocuments}
          allDocuments={data?.dokumenter ?? EMPTY_ARRAY}
        />
        <Wrapper>
          <JournalfoerteDocumentsStyledListHeader>
            <SelectAll slicedFilteredDocuments={slicedFilteredDocuments} />
            <DocumentSearch setSearch={setSearch} search={search} />
            <StyledFilterDropdown
              options={kodeverkValuesToDropdownOptions(allTemaer)}
              onChange={setSelectedTemaer}
              selected={selectedTemaer}
              $area={Fields.Meta}
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
            <IncludedFilter />
          </JournalfoerteDocumentsStyledListHeader>

          <DocumentList documents={slicedFilteredDocuments} isLoading={isLoading} />

          <LoadMore
            loadedDocuments={endIndex}
            totalDocuments={totalFilteredDocuments.length}
            loading={isLoading}
            onNextPage={() => setPage(page + 1)}
          />
        </Wrapper>
      </StyledJournalfoerteDocumentsContainer>
    </SelectContextElement>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
`;

const isJournalpostType = (type: Journalposttype | string): type is Journalposttype =>
  Object.values(Journalposttype).some((value) => value === type);
