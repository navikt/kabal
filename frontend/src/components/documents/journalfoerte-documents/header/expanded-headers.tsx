import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsFilterDatoOpprettet, useDocumentsFilterDatoRegSendt } from '@app/hooks/settings/use-setting';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { DateFilter } from './date-filter';
import { useFilters } from './use-filters';

interface ExpandedHeadersProps extends ReturnType<typeof useFilters> {
  listHeight: number;
}

export const ExpandedHeaders = ({
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
  listHeight,
}: ExpandedHeadersProps) => {
  const oppgaveId = useOppgaveId();
  const { data } = useGetArkiverteDokumenterQuery(oppgaveId);
  const { columns } = useArchivedDocumentsColumns();
  const datoOpprettetSetting = useDocumentsFilterDatoOpprettet();
  const datoRegSendtSetting = useDocumentsFilterDatoRegSendt();

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
      {columns.TEMA ? (
        <StyledFilterDropdown
          options={kodeverkValuesToDropdownOptions(allTemaer)}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          $area={Fields.Tema}
          data-testid="filter-tema"
        >
          Tema
        </StyledFilterDropdown>
      ) : null}

      {columns.DATO_OPPRETTET ? (
        <DateFilter {...datoOpprettetSetting} label="Dato opprettet" gridArea={Fields.DatoOpprettet} />
      ) : null}
      {columns.DATO_REG_SENDT ? (
        <DateFilter {...datoRegSendtSetting} label="Dato reg./sendt" gridArea={Fields.DatoRegSendt} />
      ) : null}

      {columns.AVSENDER_MOTTAKER ? (
        <StyledFilterDropdown
          options={avsenderMottakerOptions}
          onChange={setSelectedAvsenderMottakere}
          selected={selectedAvsenderMottakere}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          $area={Fields.AvsenderMottaker}
          data-testid="filter-avsender-mottaker"
        >
          Avsender/mottaker
        </StyledFilterDropdown>
      ) : null}

      {columns.SAKSNUMMER ? (
        <StyledFilterDropdown
          options={saksIdOptions}
          onChange={setSelectedSaksIds}
          selected={selectedSaksIds}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          $area={Fields.Saksnummer}
          data-testid="filter-saksnummer"
        >
          Saksnummer
        </StyledFilterDropdown>
      ) : null}

      {columns.TYPE ? (
        <StyledFilterDropdown
          options={JOURNALPOSTTYPE_OPTIONS}
          onChange={(types) => setSelectedTypes(types.filter(isJournalpostType))}
          selected={selectedTypes}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          $area={Fields.Type}
          data-testid="filter-type"
        >
          Type
        </StyledFilterDropdown>
      ) : null}
    </>
  );
};

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

const StyledFilterDropdown = styled(FilterDropdown)<{ $area: Fields }>`
  grid-area: ${({ $area }) => $area};
`;

const isJournalpostType = (type: Journalposttype | string): type is Journalposttype =>
  Object.values(Journalposttype).some((value) => value === type);
