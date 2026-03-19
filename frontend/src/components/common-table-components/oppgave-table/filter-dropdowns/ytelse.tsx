import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableYtelser } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useSettingsYtelser } from '@/hooks/use-settings-ytelser';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const Ytelse = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const ytelseOptions = useSettingsYtelser();
  const [ytelser, setYtelser] = useOppgaveTableYtelser(tableKey);

  const selectedValues = useMemo(
    () => ytelseOptions.filter((o) => ytelser?.includes(o.id) === true),
    [ytelseOptions, ytelser],
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
        options={ytelseOptions}
        value={selectedValues}
        valueKey={kodeverkSimpleValueKey}
        formatOption={kodeverkSimpleFormatOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        filterText={kodeverkSimpleFilterText}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};

const kodeverkSimpleValueKey = (option: IKodeverkSimpleValue): string => option.id;

const kodeverkSimpleFormatOption = (option: IKodeverkSimpleValue): string => option.navn;

const kodeverkSimpleFilterText = (option: IKodeverkSimpleValue): string => option.navn;
