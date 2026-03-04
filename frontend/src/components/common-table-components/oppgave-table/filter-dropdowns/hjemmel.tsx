import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableHjemler } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useSettingsHjemler } from '@app/hooks/use-settings-hjemler';
import type { IKodeverkValue } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

export const Hjemmel = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const hjemlerOptions = useSettingsHjemler();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  const selectedValues = useMemo(
    () => hjemlerOptions.filter((o) => hjemler?.includes(o.id) === true),
    [hjemlerOptions, hjemler],
  );

  const handleChange = useCallback(
    (values: IKodeverkValue[]) => {
      setHjemler(values.length === 0 ? undefined : values.map((v) => v.id));
    },
    [setHjemler],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? 'Hjemmel'}
        options={hjemlerOptions}
        value={selectedValues}
        valueKey={hjemmelValueKey}
        formatOption={formatHjemmelOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? 'Hjemmel'}
        filterText={hjemmelFilterText}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};

const hjemmelValueKey = (option: IKodeverkValue): string => option.id;

const formatHjemmelOption = (option: IKodeverkValue): string => option.beskrivelse;

const hjemmelFilterText = (option: IKodeverkValue): string => option.beskrivelse;
