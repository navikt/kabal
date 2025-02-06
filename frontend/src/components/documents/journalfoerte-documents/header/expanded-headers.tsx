import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  ArchivedDocumentsColumn,
  useArchivedDocumentsColumns,
} from '@app/hooks/settings/use-archived-documents-setting';
import {
  type ArchivedDocumentsSort,
  type ArchivedDocumentsSortColumn,
  useDocumentsFilterDatoOpprettet,
  useDocumentsFilterDatoRegSendt,
} from '@app/hooks/settings/use-setting';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { DateFilter } from './date-filter';
import type { useFilters } from './use-filters';

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
  sort,
  setSort,
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
        <HStack align="center" as="span">
          <SortButton column={ArchivedDocumentsColumn.DATO_OPPRETTET} sort={sort} setSort={setSort} />
          <DateFilter {...datoOpprettetSetting} label="Dato opprettet" gridArea={Fields.DatoOpprettet} />
        </HStack>
      ) : null}
      {columns.DATO_REG_SENDT ? (
        <HStack align="center" as="span">
          <SortButton column={ArchivedDocumentsColumn.DATO_REG_SENDT} sort={sort} setSort={setSort} />
          <DateFilter {...datoRegSendtSetting} label="Dato reg./sendt" gridArea={Fields.DatoRegSendt} />
        </HStack>
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

const SortButton = ({
  column,
  sort,
  setSort,
}: {
  column: ArchivedDocumentsSortColumn;
  sort: ArchivedDocumentsSort;
  setSort: (sort: ArchivedDocumentsSort) => void;
}) => (
  <Button
    icon={getSortIcon(sort, column)}
    variant="tertiary-neutral"
    size="small"
    onClick={() =>
      setSort({
        order: column === sort.orderBy && sort.order === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC,
        orderBy: column,
      })
    }
  />
);

const getSortIcon = (sort: ArchivedDocumentsSort, column: ArchivedDocumentsSortColumn) => {
  if (sort.orderBy === column) {
    return sort.order === 'desc' ? <ArrowDownIcon aria-hidden /> : <ArrowUpIcon aria-hidden />;
  }

  return <ArrowsUpDownIcon aria-hidden />;
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
