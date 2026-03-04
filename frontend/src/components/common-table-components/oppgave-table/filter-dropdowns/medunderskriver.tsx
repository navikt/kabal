import { StaticDataContext } from '@app/components/app/static-data-context';
import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableMedunderskrivere } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useGetMedunderskrivereForEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import type { INavEmployee } from '@app/types/bruker';
import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';

export const Medunderskriver = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { user } = useContext(StaticDataContext);
  const { data } = useGetMedunderskrivereForEnhetQuery(user.ansattEnhet.id);
  const options = useMemo<INavEmployee[]>(() => data?.medunderskrivere ?? [], [data]);
  const [medunderskrivere, setMedunderskrivere] = useOppgaveTableMedunderskrivere(tableKey);

  const selectedEmployees = useMemo(
    () => options.filter((e) => medunderskrivere?.includes(e.navIdent) === true),
    [options, medunderskrivere],
  );

  const handleChange = useCallback(
    (employees: INavEmployee[]) => {
      setMedunderskrivere(employees.length === 0 ? undefined : employees.map((e) => e.navIdent));
    },
    [setMedunderskrivere],
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

const formatEmployeeOption = (employee: INavEmployee) => (
  <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
    <span>{employee.navn}</span>
    <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
      {employee.navIdent}
    </Tag>
  </div>
);

const employeeFilterText = (employee: INavEmployee): string => `${employee.navn} ${employee.navIdent}`;
