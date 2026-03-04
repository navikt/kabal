import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { DateFilter } from '@app/components/documents/journalfoerte-documents/header/date-filter';
import type { useFilters } from '@app/components/documents/journalfoerte-documents/header/use-filters';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
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
import { useCallback, useMemo } from 'react';

export const ExpandedHeaders = ({
  selectedTemaer,
  setSelectedTemaer,
  selectedAvsenderMottakere,
  setSelectedAvsenderMottakere,
  selectedSaksIds,
  setSelectedSaksIds,
  selectedTypes,
  setSelectedTypes,
  sort,
  setSort,
}: ReturnType<typeof useFilters>) => {
  const oppgaveId = useOppgaveId();
  const { data } = useGetArkiverteDokumenterQuery(oppgaveId);
  const { columns } = useArchivedDocumentsColumns();
  const datoOpprettetSetting = useDocumentsFilterDatoOpprettet();
  const datoSorteringSetting = useDocumentsFilterDatoSortering();

  const avsenderMottakerOptions = useMemo(
    () =>
      (data?.avsenderMottakerList ?? []).map(({ id, navn }) => ({
        label: navn ?? 'Ukjent',
        value: id ?? navn ?? 'UNKNOWN',
      })),
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
        <OptionMultiSelect
          options={kodeverkValuesToDropdownOptions(allTemaer)}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
          style={{ gridArea: Fields.Tema }}
          label="Tema"
        />
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
        <OptionMultiSelect
          options={avsenderMottakerOptions}
          onChange={setSelectedAvsenderMottakere}
          selected={selectedAvsenderMottakere}
          style={{ gridArea: Fields.AvsenderMottaker }}
          label="Avsender/mottaker"
        />
      ) : null}

      {columns.SAKSNUMMER ? (
        <OptionMultiSelect
          options={saksIdOptions}
          onChange={setSelectedSaksIds}
          selected={selectedSaksIds}
          style={{ gridArea: Fields.Saksnummer }}
          label="Saksnummer"
        />
      ) : null}

      {columns.TYPE ? (
        <OptionMultiSelect
          options={JOURNALPOSTTYPE_OPTIONS}
          onChange={(types) => setSelectedTypes(types.filter(isJournalpostType))}
          selected={selectedTypes}
          style={{ gridArea: Fields.Type }}
          label="Type"
        />
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
    data-color="neutral"
    icon={getSortIcon(sort, column)}
    variant="tertiary"
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

interface OptionSelectOption {
  value: string;
  label: string;
}

interface OptionMultiSelectProps<T extends string> {
  options: OptionSelectOption[];
  selected: T[];
  onChange: (values: T[]) => void;
  style?: React.CSSProperties;
  label: string;
}

const OptionMultiSelect = <T extends string>({
  options,
  selected,
  onChange,
  style,
  label,
}: OptionMultiSelectProps<T>) => {
  const selectedOptions = useMemo(
    () => options.filter((o) => (selected as string[]).includes(o.value)),
    [options, selected],
  );

  const handleChange = useCallback(
    (values: OptionSelectOption[]) => {
      onChange(values.map((v) => v.value) as T[]);
    },
    [onChange],
  );

  return (
    <SearchableMultiSelect
      label={label}
      options={options}
      value={selectedOptions}
      valueKey={(o) => o.value}
      formatOption={(o) => o.label}
      emptyLabel={label}
      filterText={(o) => o.label}
      onChange={handleChange}
      style={style}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
    />
  );
};

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

const JOURNALPOSTTYPE_VALUES = Object.values(Journalposttype);

const isJournalpostType = (type: Journalposttype | string): type is Journalposttype =>
  JOURNALPOSTTYPE_VALUES.some((value) => value === type);
