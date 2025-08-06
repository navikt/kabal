import { StaticDataContext } from '@app/components/app/static-data-context';
import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/helpers';
import { useOppgaveTableTildelteSaksbehandlere } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import type { IOption } from '@app/components/filter-dropdown/props';
import { useGetSaksbehandlereInEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Table } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';
import type { FilterDropdownProps } from './types';

export const Saksbehandler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { user } = useContext(StaticDataContext);
  const { data } = useGetSaksbehandlereInEnhetQuery(user.ansattEnhet.id);
  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.saksbehandlere), [data]);
  const [tildelteSaksbehandlere, setTildelteSaksbehandlere] = useOppgaveTableTildelteSaksbehandlere(tableKey);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FilterDropdown
        selected={tildelteSaksbehandlere ?? []}
        onChange={setTildelteSaksbehandlere}
        options={options}
        data-testid="filter-saksbehandler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
