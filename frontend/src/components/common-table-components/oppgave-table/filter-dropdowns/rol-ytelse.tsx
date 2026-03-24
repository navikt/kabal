import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableYtelser } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useSimpleYtelser } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const RolYtelse = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data } = useSimpleYtelser();
  const [ytelser, setYtelser] = useOppgaveTableYtelser(tableKey);

  const options = useMemo<Entry<IKodeverkSimpleValue>[]>(
    () =>
      (data ?? []).map((o) => ({
        value: o,
        key: o.id,
        label: o.navn,
        plainText: o.navn,
      })),
    [data],
  );

  const selectedEntries = useMemo(
    () => options.filter((entry) => ytelser?.includes(entry.key) === true),
    [options, ytelser],
  );

  const handleChange = useCallback(
    (values: IKodeverkSimpleValue[]) => {
      const ids = values.map((v) => v.id);
      setYtelser(ids.length === 0 ? undefined : ids);
    },
    [setYtelser],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={options}
        value={selectedEntries}
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
