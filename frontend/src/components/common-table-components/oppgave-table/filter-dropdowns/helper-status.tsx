import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type {
  FilterDropdownProps,
  HelperStatus,
} from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import {
  CommonHelperStatus,
  HelperStatusSelf,
} from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import {
  useOppgaveTableHelperStatusWithoutSelf,
  useOppgaveTableHelperStatusWithSelf,
} from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';

interface StatusOption {
  value: HelperStatus[];
  label: string;
}

const toEntry = (option: StatusOption): Entry<StatusOption> => ({
  value: option,
  key: option.value.map((v) => v).join(','),
  label: option.label,
  plainText: option.label,
});

export const HelperStatusWithoutSelf = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [statuses, setStatuses] = useOppgaveTableHelperStatusWithoutSelf(tableKey);

  const allOptions = OPTIONS_WITHOUT_SELF;

  const selectedOptions = useMemo(
    () => allOptions.filter((entry) => statuses?.some((status) => entry.value.value.includes(status)) === true),
    [statuses],
  );

  const handleChange = useCallback(
    (values: StatusOption[]) => {
      const newStatuses = values.flatMap((v) => v.value);
      setStatuses(newStatuses.length === 0 ? undefined : newStatuses);
    },
    [setStatuses],
  );

  const label = TABLE_HEADERS[columnKey] ?? 'Status';

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={label}
        options={allOptions}
        value={selectedOptions}
        emptyLabel={label}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};

export const HelperStatusWithSelf = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [statuses, setStatuses] = useOppgaveTableHelperStatusWithSelf(tableKey);

  const allOptions = OPTIONS_WITH_SELF;

  const selectedOptions = useMemo(
    () => allOptions.filter((entry) => statuses?.some((status) => entry.value.value.includes(status)) === true),
    [statuses],
  );

  const handleChange = useCallback(
    (values: StatusOption[]) => {
      const newStatuses = values.flatMap((v) => v.value);
      setStatuses(newStatuses.length === 0 ? undefined : newStatuses);
    },
    [setStatuses],
  );

  const label = TABLE_HEADERS[columnKey] ?? 'Status';

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={label}
        options={allOptions}
        value={selectedOptions}
        emptyLabel={label}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};

const RETURNED_FROM_MU_STATUSES = [
  CommonHelperStatus.RETURNERT_FRA_MU,
  CommonHelperStatus.RETURNERT_FRA_MU_MED_GODKJENNING,
  CommonHelperStatus.RETURNERT_FRA_MU_UTEN_GODKJENNING,
];

const COMMON_ROL_OPTIONS: Entry<StatusOption>[] = [
  { value: [CommonHelperStatus.SENDT_TIL_FELLES_ROL_KOE], label: 'I felles kø for ROL' },
  { value: [CommonHelperStatus.SENDT_TIL_ROL], label: 'Sendt til ROL' },
  { value: [CommonHelperStatus.RETURNERT_FRA_ROL], label: 'Tilbake fra ROL' },
].map(toEntry);

const COMMON_MU_OPTIONS: Entry<StatusOption>[] = [
  { value: [CommonHelperStatus.SENDT_TIL_MU], label: 'Sendt til MU' },
  { value: RETURNED_FROM_MU_STATUSES, label: 'Tilbake fra MU' },
].map(toEntry);

const MU_OPTION: Entry<StatusOption> = toEntry({ value: [HelperStatusSelf.MU], label: 'MU' });

const OPTIONS_WITHOUT_SELF: Entry<StatusOption>[] = [...COMMON_MU_OPTIONS, ...COMMON_ROL_OPTIONS];

const OPTIONS_WITH_SELF: Entry<StatusOption>[] = [MU_OPTION, ...COMMON_MU_OPTIONS, ...COMMON_ROL_OPTIONS];
