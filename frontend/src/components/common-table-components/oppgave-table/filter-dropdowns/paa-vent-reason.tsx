import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTablePaaVentReasons } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { usePaaVentReasons } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkValue } from '@/types/kodeverk';

export const PaaVentReasons = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [reasons, setReasons] = useOppgaveTablePaaVentReasons(tableKey);
  const { data = [] } = usePaaVentReasons();

  const options = useMemo<Entry<IKodeverkValue>[]>(
    () =>
      data.map((o) => ({
        value: o,
        key: o.id,
        label: o.beskrivelse,
        plainText: o.beskrivelse,
      })),
    [data],
  );

  const selectedValues = useMemo(() => options.filter((o) => reasons?.includes(o.key) === true), [options, reasons]);

  const handleChange = useCallback(
    (values: IKodeverkValue[]) => {
      setReasons(values.length === 0 ? undefined : values.map((v) => v.id));
    },
    [setReasons],
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
