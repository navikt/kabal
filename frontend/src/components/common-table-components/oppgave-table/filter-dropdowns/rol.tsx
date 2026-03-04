import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTildelteRol } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useGetRolsInEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import type { INavEmployee } from '@app/types/bruker';
import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

export const Rol = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data } = useGetRolsInEnhetQuery();
  const options = useMemo<INavEmployee[]>(() => data?.rolList ?? [], [data]);
  const [tildelteRol, setTildelteRol] = useOppgaveTableTildelteRol(tableKey);

  const selectedEmployees = useMemo(
    () => options.filter((e) => tildelteRol?.includes(e.navIdent) === true),
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
        value={selectedEmployees}
        valueKey={employeeValueKey}
        formatOption={formatEmployeeOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        filterText={employeeFilterText}
        onChange={handleChange}
        confirmLabel="Bekreft"
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};

const employeeValueKey = (employee: INavEmployee): string => employee.navIdent;

const employeeFilterText = (employee: INavEmployee): string => `${employee.navn} ${employee.navIdent}`;

const formatEmployeeOption = (employee: INavEmployee) => (
  <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
    <span>{employee.navn}</span>
    <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
      {employee.navIdent}
    </Tag>
  </div>
);
