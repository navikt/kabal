import { Filter2 } from '@navikt/ds-icons';
import { Button, Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useAllTemaer } from '../../../../hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { IArkivertDocument, Journalposttype } from '../../../../types/arkiverte-documents';
import { kodeverkValuesToDropdownOptions } from '../../../filter-dropdown/functions';
import { StyledJournalfoerteDocumentsContainer } from '../styled-components/container';
import { StyledDocumentListItem, StyledJournalfoerteDocumentList } from '../styled-components/document-list';
import { Fields } from '../styled-components/grid';
import { JournalfoerteDocumentsStyledListHeader, StyledFilterDropdown } from '../styled-components/list-header';
import { DateFilter } from './date-filter';
import { Document } from './document';
import { filterDocuments, getAvsenderMottakerOptions, getSaksIdOptions } from './filter-helpers';
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
  const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAvsenderMottakere, setSelectedAvsenderMottakere] = useState<string[]>([]);
  const [selectedSaksIds, setSelectedSaksIds] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const avsenderMottakerOptions = useMemo(() => getAvsenderMottakerOptions(documents), [documents]);
  const saksIdOptions = useMemo(() => getSaksIdOptions(documents), [documents]);

  const totalFilteredDocuments = useMemo(
    () =>
      filterDocuments(
        documents,
        selectedAvsenderMottakere,
        selectedDateRange,
        selectedSaksIds,
        selectedTemaer,
        selectedTypes
      ),
    [documents, selectedAvsenderMottakere, selectedDateRange, selectedSaksIds, selectedTemaer, selectedTypes]
  );

  const endIndex = PAGE_SIZE * page;

  const slicedFilteredDocuments = useMemo(
    () => totalFilteredDocuments.slice(0, endIndex),
    [endIndex, totalFilteredDocuments]
  );

  const allTemaer = useAllTemaer();

  const resetFiltes = () => {
    setSelectedTemaer([]);
    setSelectedTypes([]);
    setSelectedAvsenderMottakere([]);
    setSelectedSaksIds([]);
    setSelectedDateRange(undefined);
  };

  const resetFiltersDisabled = useMemo(
    () =>
      selectedTemaer.length === 0 &&
      selectedTypes.length === 0 &&
      selectedAvsenderMottakere.length === 0 &&
      selectedSaksIds.length === 0 &&
      selectedDateRange === undefined,
    [
      selectedAvsenderMottakere.length,
      selectedDateRange,
      selectedSaksIds.length,
      selectedTemaer.length,
      selectedTypes.length,
    ]
  );

  const totaltAntall = data?.totaltAntall ?? 0;

  return (
    <StyledJournalfoerteDocumentsContainer data-testid="oppgavebehandling-documents-all">
      <Wrapper>
        <JournalfoerteDocumentsStyledListHeader>
          <Button
            disabled={resetFiltersDisabled}
            size="small"
            variant="danger"
            onClick={resetFiltes}
            icon={<Filter2 aria-hidden />}
            title="Fjern filtere"
          />
          <Heading
            size="xsmall"
            level="2"
            title={`Viser ${slicedFilteredDocuments.length} av ${totalFilteredDocuments.length} filtrerte dokumenter. Totalt ${totaltAntall} dokumenter`}
          >
            Journalførte dokumenter ({totalFilteredDocuments.length})
          </Heading>
          <StyledFilterDropdown
            options={kodeverkValuesToDropdownOptions(allTemaer)}
            onChange={setSelectedTemaer}
            selected={selectedTemaer}
            $area={Fields.Meta}
          >
            Tema
          </StyledFilterDropdown>
          <DateFilter onChange={setSelectedDateRange} selected={selectedDateRange}>
            Sendt
          </DateFilter>

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
            onChange={setSelectedTypes}
            selected={selectedTypes}
            direction="left"
            $area={Fields.Type}
          >
            Type
          </StyledFilterDropdown>
        </JournalfoerteDocumentsStyledListHeader>
        <StyledJournalfoerteDocumentList data-testid="oppgavebehandling-documents-all-list">
          <DocumentsSpinner hasDocuments={!isLoading} />
          {slicedFilteredDocuments.map((document) => (
            <StyledDocumentListItem
              key={`dokument_${document.journalpostId}_${document.dokumentInfoId}`}
              data-testid="oppgavebehandling-documents-all-list-item"
              data-documentname={document.tittel}
            >
              <Document
                document={document}
                setAvsenderMottaker={(id) => setSelectedAvsenderMottakere([id])}
                setTema={(tema) => setSelectedTemaer([tema])}
                setSaksId={(saksId) => setSelectedSaksIds([saksId])}
              />
            </StyledDocumentListItem>
          ))}
        </StyledJournalfoerteDocumentList>

        <LoadMore
          loadedDocuments={endIndex}
          totalDocuments={totalFilteredDocuments.length}
          loading={isLoading}
          onNextPage={() => setPage(page + 1)}
        />
      </Wrapper>
    </StyledJournalfoerteDocumentsContainer>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface DocumentsSpinnerProps {
  hasDocuments: boolean;
}

const DocumentsSpinner = ({ hasDocuments }: DocumentsSpinnerProps): JSX.Element | null => {
  if (hasDocuments) {
    return null;
  }

  return <Loader size="xlarge" />;
};
