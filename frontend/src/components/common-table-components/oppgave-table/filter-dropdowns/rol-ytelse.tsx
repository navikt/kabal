import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableYtelser } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useSimpleYtelser } from '@app/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

const valueKey = (option: IKodeverkSimpleValue): string => option.id;
const formatOption = (option: IKodeverkSimpleValue): string => option.navn;
const filterText = (option: IKodeverkSimpleValue): string => option.navn;

export const RolYtelse = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data } = useSimpleYtelser();
  const ytelseOptions = useMemo(() => data ?? [], [data]);
  const [ytelser, setYtelser] = useOppgaveTableYtelser(tableKey);

  const selectedOptions = useMemo(
    () => ytelseOptions.filter((option) => ytelser?.includes(option.id) === true),
    [ytelseOptions, ytelser],
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
        options={ytelseOptions}
        value={selectedOptions}
        valueKey={valueKey}
        formatOption={formatOption}
        filterText={filterText}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        onChange={handleChange}
        confirmLabel="Bekreft"
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};
