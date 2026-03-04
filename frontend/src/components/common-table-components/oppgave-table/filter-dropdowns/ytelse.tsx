import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableYtelser } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useSettingsYtelser } from '@app/hooks/use-settings-ytelser';
import type { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

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
