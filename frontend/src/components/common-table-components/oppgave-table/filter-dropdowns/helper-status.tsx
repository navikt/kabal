import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type {
  FilterDropdownProps,
  HelperStatus,
} from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import {
  CommonHelperStatus,
  HelperStatusSelf,
} from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { ShortParamKey } from '@/components/common-table-components/oppgave-table/state/short-names';
import {
  fromTyperParam,
  useOppgaveTableHelperStatusWithoutSelf,
  useOppgaveTableHelperStatusWithSelf,
  useOppgaveTableTyper,
} from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { SaksTypeEnum } from '@/types/kodeverk';

interface StatusOption {
  value: HelperStatus;
  label: string;
}

const toEntry = (option: StatusOption): Entry<StatusOption> => ({
  value: option,
  key: option.value,
  label: option.label,
  plainText: option.label,
});

export const HelperStatusWithoutSelf = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [statuses, setStatuses] = useOppgaveTableHelperStatusWithoutSelf(tableKey);

  const [query] = useSearchParams();
  const typer = fromTyperParam(query.get(`${tableKey}.${ShortParamKey.TYPER}`)) ?? [];

  const allOptions = useMemo(() => getOptionsWithoutSelf(typer), [typer]);

  const selectedOptions = useMemo(
    () => allOptions.filter((entry) => statuses?.includes(entry.value.value) === true),
    [allOptions, statuses],
  );

  const handleChange = useCallback(
    (values: StatusOption[]) => {
      const newStatuses = values.map((v) => v.value);
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
  const [typer = []] = useOppgaveTableTyper(tableKey);
  const [statuses, setStatuses] = useOppgaveTableHelperStatusWithSelf(tableKey);

  const allOptions = useMemo(() => getOptionsWithSelf(typer), [typer]);

  const selectedOptions = useMemo(
    () => allOptions.filter((entry) => statuses?.includes(entry.value.value) === true),
    [allOptions, statuses],
  );

  const handleChange = useCallback(
    (values: StatusOption[]) => {
      const newStatuses = values.map((v) => v.value);
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

const COMMON_ROL_OPTIONS: Entry<StatusOption>[] = [
  { value: CommonHelperStatus.SENDT_TIL_FELLES_ROL_KOE, label: 'I felles kø for ROL' },
  { value: CommonHelperStatus.SENDT_TIL_ROL, label: 'Sendt til ROL' },
  { value: CommonHelperStatus.RETURNERT_FRA_ROL, label: 'Tilbake fra ROL' },
].map(toEntry);

const COMMON_NON_ANKE_I_TR_MU_OPTIONS: Entry<StatusOption>[] = [
  { value: CommonHelperStatus.SENDT_TIL_MU, label: 'Sendt til MU' },
  { value: CommonHelperStatus.RETURNERT_FRA_MU, label: 'Tilbake fra MU' },
].map(toEntry);

const COMMON_ANKE_I_TR_MU_OPTIONS: Entry<StatusOption>[] = [
  { value: CommonHelperStatus.SENDT_TIL_MU, label: 'Sendt til fagansvarlig' },
  { value: CommonHelperStatus.RETURNERT_FRA_MU, label: 'Tilbake fra fagansvarlig' },
].map(toEntry);

const COMMON_COMBO_MU_OPTIONS: Entry<StatusOption>[] = [
  { value: CommonHelperStatus.SENDT_TIL_MU, label: 'Sendt til MU/fagansvarlig' },
  { value: CommonHelperStatus.RETURNERT_FRA_MU, label: 'Tilbake fra MU/fagansvarlig' },
].map(toEntry);

const NON_ANKE_I_TR_MU_OPTION: Entry<StatusOption> = toEntry({ value: HelperStatusSelf.MU, label: 'MU' });
const ANKE_I_TR_MU_OPTION: Entry<StatusOption> = toEntry({ value: HelperStatusSelf.MU, label: 'Fagansvarlig' });
const COMBO_MU_OPTION: Entry<StatusOption> = toEntry({ value: HelperStatusSelf.MU, label: 'MU/fagansvarlig' });

const getMuOptions = (typer: SaksTypeEnum[]): Entry<StatusOption>[] => {
  if (typer.length === 0) {
    return COMMON_COMBO_MU_OPTIONS;
  }

  if (typer.every((type) => type !== SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
    return COMMON_NON_ANKE_I_TR_MU_OPTIONS;
  }

  if (typer.every((type) => type === SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
    return COMMON_ANKE_I_TR_MU_OPTIONS;
  }

  return COMMON_COMBO_MU_OPTIONS;
};

const getSelfOption = (typer: SaksTypeEnum[]): Entry<StatusOption> => {
  if (typer.length === 0) {
    return COMBO_MU_OPTION;
  }

  if (typer.every((type) => type !== SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
    return NON_ANKE_I_TR_MU_OPTION;
  }

  if (typer.every((type) => type === SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
    return ANKE_I_TR_MU_OPTION;
  }

  return COMBO_MU_OPTION;
};

const getOptionsWithoutSelf = (typer: SaksTypeEnum[]): Entry<StatusOption>[] => [
  ...getMuOptions(typer),
  ...COMMON_ROL_OPTIONS,
];

const getOptionsWithSelf = (typer: SaksTypeEnum[]): Entry<StatusOption>[] => [
  getSelfOption(typer),
  ...getMuOptions(typer),
  ...COMMON_ROL_OPTIONS,
];
