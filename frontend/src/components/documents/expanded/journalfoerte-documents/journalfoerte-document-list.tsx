import { Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { isWithinInterval, parseISO } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useAllTemaer } from '../../../../hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { IArkivertDocument, Journalposttype } from '../../../../types/arkiverte-documents';
import { kodeverkValuesToDropdownOptions } from '../../../filter-dropdown/functions';
import { IOption } from '../../../filter-dropdown/props';
import { StyledJournalfoerteDocumentsContainer } from '../styled-components/container';
import { StyledDocumentListItem, StyledJournalfoerteDocumentList } from '../styled-components/document-list';
import { Fields } from '../styled-components/grid';
import { JournalfoerteDocumentsStyledListHeader, StyledFilterDropdown } from '../styled-components/list-header';
import { DateFilter } from './date-filter';
import { Document } from './document';
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
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const endIndex = PAGE_SIZE * page;

  const avsenderMottakerOptions = useMemo(
    () =>
      documents.reduce<IOption<string>[]>((acc, { avsenderMottaker }) => {
        if (avsenderMottaker === null) {
          if (acc.every((am) => am.value !== 'NONE')) {
            acc.push({ label: 'Ingen', value: 'NONE' });
          }

          return acc;
        }

        const { navn, id } = avsenderMottaker;

        const label = navn ?? id ?? 'Ukjent';
        const value = id ?? 'UNKNOWN';

        if (acc.some((am) => am.value === value)) {
          return acc;
        }

        acc.push({ label, value });

        return acc;
      }, []),
    [documents]
  );

  const totalFilteredDocuments = useMemo(
    () =>
      documents.filter(
        ({ tema, journalposttype, avsenderMottaker, registrert }) =>
          (selectedTemaer.length === 0 || (tema !== null && selectedTemaer.includes(tema))) &&
          (selectedTypes.length === 0 || (journalposttype !== null && selectedTypes.includes(journalposttype))) &&
          (selectedAvsenderMottakere.length === 0 ||
            selectedAvsenderMottakere.includes(
              avsenderMottaker === null ? 'NONE' : avsenderMottaker.id ?? 'UNKNOWN'
            )) &&
          (selectedDateRange === undefined || checkDateInterval(registrert, selectedDateRange))
      ),
    [documents, selectedAvsenderMottakere, selectedDateRange, selectedTemaer, selectedTypes]
  );

  const slicedFilteredDocuments = useMemo(
    () => totalFilteredDocuments.slice(0, endIndex),
    [endIndex, totalFilteredDocuments]
  );

  const allTemaer = useAllTemaer();

  const totaltAntall = data?.totaltAntall ?? 0;

  return (
    <StyledJournalfoerteDocumentsContainer data-testid="oppgavebehandling-documents-all">
      <Wrapper>
        <JournalfoerteDocumentsStyledListHeader>
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
          <Heading size="xsmall" level="2">
            Saks-ID
          </Heading>
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
              <Document document={document} />
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

JournalfoerteDocumentList.displayName = 'JournalfoerteDocuments';

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

const checkDateInterval = (date: string, { from, to }: DateRange) => {
  if (from !== undefined && to !== undefined) {
    return isWithinInterval(parseISO(date), { start: from, end: to });
  }

  return true;
};
