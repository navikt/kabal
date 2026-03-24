import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTildelteRol } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useGetRolsInEnhetQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import type { INavEmployee } from '@/types/bruker';

const toEmployeeEntry = (employee: INavEmployee): Entry<INavEmployee> => ({
  value: employee,
  key: employee.navIdent,
  label: (
    <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
      <span>{employee.navn}</span>
      <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
        {employee.navIdent}
      </Tag>
    </div>
  ),
  plainText: `${employee.navn} ${employee.navIdent}`,
});

export const Rol = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data } = useGetRolsInEnhetQuery();
  const options = useMemo<Entry<INavEmployee>[]>(() => (data?.rolList ?? []).map(toEmployeeEntry), [data]);
  const [tildelteRol, setTildelteRol] = useOppgaveTableTildelteRol(tableKey);

  const selectedEntries = useMemo(
    () => options.filter((entry) => tildelteRol?.includes(entry.key) === true),
    [options, tildelteRol],
  );

  const handleChange = useCallback(
    (employees: INavEmployee[]) => {
      const idents = employees.map((e) => e.navIdent);
      setTildelteRol(idents.length === 0 ? undefined : idents);
    },
    [setTildelteRol],
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
