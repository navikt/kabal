import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTyper } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { SaksTypeEnum } from '@/types/kodeverk';

interface SaksTypeOption {
  value: SaksTypeEnum;
  label: string;
}

const toEntries = (options: SaksTypeOption[]): Entry<SaksTypeOption>[] =>
  options.map((o) => ({ value: o, key: o.value, label: o.label, plainText: o.label }));

const BASE_OPTIONS: SaksTypeOption[] = [
  { value: SaksTypeEnum.KLAGE, label: 'Klage' },
  { value: SaksTypeEnum.ANKE, label: 'Anke før 1.1.27' },
  { value: SaksTypeEnum.OMGJØRINGSKRAV, label: 'Omgjøringskrav' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK, label: 'Begjæring om gjenopptak' },
];

const OPTIONS_WITH_TR_BEFORE_2027 = [
  { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i TR før 1.1.27' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, label: 'Begjæring om gjenopptak i Trygderetten' },
  { value: SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET, label: 'Behandling etter Trygderetten opphevet' },
];

const OPTIONS_FOR_SAKER_I_TR = [
  { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i TR før 1.1.27' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, label: 'Begjæring om gjenopptak i TR' },
  { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027, label: 'Anke i Trygderetten' },
];

const OPTIONS_FOR_ANKE_AFTER_2027 = [
  { value: SaksTypeEnum.ANKE_AFTER_2027, label: 'Anke' },
  { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027, label: 'Anke i Trygderetten' },
];

export const Sakstype = (props: FilterDropdownProps) => <Filter {...props} options={toEntries(BASE_OPTIONS)} />;

export const SakstypeForSakerITR = (props: FilterDropdownProps) => (
  <Filter {...props} options={toEntries(OPTIONS_FOR_SAKER_I_TR)} />
);

export const SakstypeForAnkeAfter2027 = (props: FilterDropdownProps) => (
  <Filter {...props} options={toEntries(OPTIONS_FOR_ANKE_AFTER_2027)} />
);

export const AllSakstyper = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    options={toEntries([...BASE_OPTIONS, ...OPTIONS_WITH_TR_BEFORE_2027, ...OPTIONS_FOR_SAKER_I_TR])}
  />
);

const Filter = ({ columnKey, tableKey, options }: FilterDropdownProps & { options: Entry<SaksTypeOption>[] }) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);

  const selected = useMemo(() => {
    const selectedSet = new Set(typer ?? []);

    return options.filter((entry) => selectedSet.has(entry.value.value));
  }, [typer, options]);

  const onChange = useCallback(
    (values: SaksTypeOption[]) => {
      setTyper(values.length === 0 ? undefined : values.map((v) => v.value));
    },
    [setTyper],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={options}
        value={selected}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        onChange={onChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};
