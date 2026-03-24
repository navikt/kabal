import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableYtelser } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useSettingsYtelser } from '@/hooks/use-settings-ytelser';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const Ytelse = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const ytelseOptions = useSettingsYtelser();
  const [ytelser, setYtelser] = useOppgaveTableYtelser(tableKey);

  const options = useMemo<Entry<IKodeverkSimpleValue>[]>(
    () => ytelseOptions.map((o) => ({ value: o, key: o.id, label: o.navn, plainText: o.navn })),
    [ytelseOptions],
  );

  const selectedValues = useMemo(
    () => options.filter((entry) => ytelser?.includes(entry.key) === true),
    [options, ytelser],
  );

  const handleChange = useCallback(
    (values: IKodeverkSimpleValue[]) => {
      setYtelser(values.length === 0 ? undefined : values.map((v) => v.id));
    },
    [setYtelser],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={options}
        value={selectedValues}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};
