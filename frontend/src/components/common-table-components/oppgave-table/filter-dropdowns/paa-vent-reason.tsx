import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTablePaaVentReasons } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { usePaaVentReasons } from '@/simple-api-state/use-kodeverk';
import type { IKodeverkValue } from '@/types/kodeverk';

export const PaaVentReasons = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [reasons, setReasons] = useOppgaveTablePaaVentReasons(tableKey);
  const { data = [] } = usePaaVentReasons();

  const selectedOptions = useMemo(
    () => data.filter((option) => reasons?.includes(option.id) === true),
    [data, reasons],
  );

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
        options={data}
        value={selectedOptions}
        valueKey={kodeverkValueKey}
        formatOption={formatKodeverkOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        filterText={kodeverkFilterText}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};

const kodeverkValueKey = (option: IKodeverkValue): string => option.id;

const formatKodeverkOption = (option: IKodeverkValue) => option.beskrivelse;

const kodeverkFilterText = (option: IKodeverkValue): string => option.beskrivelse;
