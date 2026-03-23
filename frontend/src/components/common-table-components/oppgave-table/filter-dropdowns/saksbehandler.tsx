import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTildelteSaksbehandlere } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useGetSaksbehandlereInEnhetQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import type { INavEmployee } from '@/types/bruker';

export const Saksbehandler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { user } = useContext(StaticDataContext);
  const { data } = useGetSaksbehandlereInEnhetQuery(user.ansattEnhet.id);
  const employees = useMemo(() => data?.saksbehandlere ?? [], [data]);
  const [tildelteSaksbehandlere, setTildelteSaksbehandlere] = useOppgaveTableTildelteSaksbehandlere(tableKey);

  const selectedEmployees = useMemo(
    () => employees.filter((e) => tildelteSaksbehandlere?.includes(e.navIdent) === true),
    [employees, tildelteSaksbehandlere],
  );

  const handleChange = useCallback(
    (values: INavEmployee[]) => {
      setTildelteSaksbehandlere(values.length === 0 ? undefined : values.map((e) => e.navIdent));
    },
    [setTildelteSaksbehandlere],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={employees}
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
        showSelectAll
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
