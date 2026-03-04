import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableHjemler } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useAvailableHjemler } from '@app/hooks/use-available-hjemler';
import type { IKodeverkValue } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

export const EnhetHjemmel = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const enhetHjemlerOptions = useAvailableHjemler();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  const optionsByKey = useMemo(() => {
    const map = new Map<string, IKodeverkValue>();

    for (const option of enhetHjemlerOptions) {
      map.set(option.id, option);
    }

    return map;
  }, [enhetHjemlerOptions]);

  const selectedOptions = useMemo(
    () => (hjemler ?? []).map((id) => optionsByKey.get(id)).filter(isNotUndefined),
    [hjemler, optionsByKey],
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
        options={enhetHjemlerOptions}
        value={selectedOptions}
        valueKey={hjemmelValueKey}
        formatOption={hjemmelFormatOption}
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

const hjemmelFormatOption = (option: IKodeverkValue): string => option.beskrivelse;

const hjemmelFilterText = (option: IKodeverkValue): string => option.beskrivelse;
