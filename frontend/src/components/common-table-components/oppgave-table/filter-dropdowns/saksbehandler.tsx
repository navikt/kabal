import { Table } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { UserContext } from '@app/components/app/user';
import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/helpers';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { IOption } from '@app/components/filter-dropdown/props';
import { useGetSaksbehandlereInEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { FilterDropdownProps } from './types';

export const Saksbehandler = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const user = useContext(UserContext);
  const { data } = useGetSaksbehandlereInEnhetQuery(user.ansattEnhet.id);
  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.saksbehandlere), [data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.tildelteSaksbehandlere ?? []}
        onChange={(tildelteSaksbehandlere) => setParams({ ...params, tildelteSaksbehandlere })}
        options={options}
        data-testid="filter-saksbehandler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
