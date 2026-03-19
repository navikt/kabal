import { Table } from '@navikt/ds-react';
import { useCallback } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTyper } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { SaksTypeEnum } from '@/types/kodeverk';

interface SaksTypeOption {
  value: SaksTypeEnum;
  label: string;
}

const OPTIONS: SaksTypeOption[] = [
  { value: SaksTypeEnum.KLAGE, label: 'Klage' },
  { value: SaksTypeEnum.ANKE, label: 'Anke' },
  { value: SaksTypeEnum.OMGJØRINGSKRAV, label: 'Omgjøringskrav' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK, label: 'Begjæring om gjenopptak' },
];

const OPTIONS_WITH_TRYGDERETTEN: SaksTypeOption[] = [
  ...OPTIONS,
  { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i Trygderetten' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, label: 'Begjæring om gjenopptak i Trygderetten' },
  { value: SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET, label: 'Behandling etter Trygderetten opphevet' },
];

const optionValueKey = (option: SaksTypeOption): string => option.value;
const optionFilterText = (option: SaksTypeOption): string => option.label;
const optionFormatOption = (option: SaksTypeOption): string => option.label;

export const Sakstype = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);

  const selected = useSelectedOptions(typer, OPTIONS);
  const onChange = useOnChange(setTyper);

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={OPTIONS}
        value={selected}
        valueKey={optionValueKey}
        formatOption={optionFormatOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        filterText={optionFilterText}
        onChange={onChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};

export const SakstypeWithTrygderetten = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);

  const selected = useSelectedOptions(typer, OPTIONS_WITH_TRYGDERETTEN);
  const onChange = useOnChange(setTyper);

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={OPTIONS_WITH_TRYGDERETTEN}
        value={selected}
        valueKey={optionValueKey}
        formatOption={optionFormatOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        filterText={optionFilterText}
        onChange={onChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};

const useSelectedOptions = (typer: SaksTypeEnum[] | undefined, options: SaksTypeOption[]): SaksTypeOption[] => {
  const selected = typer ?? [];

  return options.filter((option) => selected.includes(option.value));
};

const useOnChange = (setTyper: (value: SaksTypeEnum[] | undefined) => void) =>
  useCallback(
    (values: SaksTypeOption[]) => {
      setTyper(values.length === 0 ? undefined : values.map((v) => v.value));
    },
    [setTyper],
  );
