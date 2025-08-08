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
  useDocumentsFilterDatoSortering,
} from '@app/hooks/settings/use-setting';
import { useAllTemaer } from '@app/hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';
import { ArrowsUpDownIcon, SortDownIcon, SortUpIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, HStack } from '@navikt/ds-react';
import { useMemo } from 'react';
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
  const datoSorteringSetting = useDocumentsFilterDatoSortering();

  const avsenderMottakerOptions = useMemo(
    () =>
      (data?.avsenderMottakerList ?? []).map(({ id, navn }) => ({ label: navn ?? 'Ukjent', value: id ?? 'UNKNOWN' })),
    [data],
  );

  const saksIdOptions = useMemo(() => {
    const result: { label: string; value: string }[] = [];

    if (data?.sakList === undefined) {
      return result;
    }

    for (const { fagsakId } of data.sakList) {
      if (fagsakId !== null) {
        result.push({ label: fagsakId, value: fagsakId });
      }
    }

    return result;
  }, [data]);

  const allTemaer = useAllTemaer();

  return (
    <>
      {columns.TEMA ? (
        <FilterDropdown
          options={kodeverkValuesToDropdownOptions(allTemaer)}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          style={{ gridArea: Fields.Tema }}
          data-testid="filter-tema"
          size="small"
        >
          Tema
        </FilterDropdown>
      ) : null}

      {columns.DATO_OPPRETTET ? (
        <HStack align="center" as="section" style={{ gridArea: Fields.DatoOpprettet }} wrap={false}>
          <SortButton column={ArchivedDocumentsColumn.DATO_OPPRETTET} sort={sort} setSort={setSort} size="small" />
          <DateFilter {...datoOpprettetSetting} label="Dato opprettet" gridArea={Fields.DatoOpprettet} />
        </HStack>
      ) : null}

      {columns.DATO_SORTERING ? (
        <HStack align="center" as="section" style={{ gridArea: Fields.DatoSortering }} wrap={false}>
          <SortButton column={ArchivedDocumentsColumn.DATO_SORTERING} sort={sort} setSort={setSort} size="small" />
          <DateFilter {...datoSorteringSetting} label="Dato reg./sendt" gridArea={Fields.DatoSortering} />
        </HStack>
      ) : null}

      {columns.AVSENDER_MOTTAKER ? (
        <FilterDropdown
          options={avsenderMottakerOptions}
          onChange={setSelectedAvsenderMottakere}
          selected={selectedAvsenderMottakere}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          style={{ gridArea: Fields.AvsenderMottaker }}
          data-testid="filter-avsender-mottaker"
          size="small"
        >
          Avsender/mottaker
        </FilterDropdown>
      ) : null}

      {columns.SAKSNUMMER ? (
        <FilterDropdown
          options={saksIdOptions}
          onChange={setSelectedSaksIds}
          selected={selectedSaksIds}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          style={{ gridArea: Fields.Saksnummer }}
          data-testid="filter-saksnummer"
          size="small"
        >
          Saksnummer
        </FilterDropdown>
      ) : null}

      {columns.TYPE ? (
        <FilterDropdown
          options={JOURNALPOSTTYPE_OPTIONS}
          onChange={(types) => setSelectedTypes(types.filter(isJournalpostType))}
          selected={selectedTypes}
          direction="left"
          maxWidth="410px"
          maxHeight={listHeight}
          style={{ gridArea: Fields.Type }}
          data-testid="filter-type"
          size="small"
        >
          Type
        </FilterDropdown>
      ) : null}
    </>
  );
};

interface SortButtonProps {
  column: ArchivedDocumentsSortColumn;
  sort: ArchivedDocumentsSort;
  setSort: (sort: ArchivedDocumentsSort) => void;
  size?: ButtonProps['size'];
}
const SortButton = ({ column, sort, setSort, size }: SortButtonProps) => (
  <Button
    icon={getSortIcon(sort, column)}
    variant="tertiary-neutral"
    size={size}
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
    return sort.order === 'desc' ? <SortDownIcon aria-hidden /> : <SortUpIcon aria-hidden />;
  }

  return <ArrowsUpDownIcon aria-hidden />;
};

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

const JOURNALPOSTTYPE_VALUES = Object.values(Journalposttype);

const isJournalpostType = (type: Journalposttype | string): type is Journalposttype =>
  JOURNALPOSTTYPE_VALUES.some((value) => value === type);
