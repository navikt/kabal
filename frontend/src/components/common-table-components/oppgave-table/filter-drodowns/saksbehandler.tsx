import { Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo } from 'react';
import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-drodowns/helpers';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { IOption } from '@app/components/filter-dropdown/props';
import { useGetSaksbehandlereInEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { FilterDropdownProps } from './types';

export const Saksbehandler = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data: bruker } = useUser();
  const { data } = useGetSaksbehandlereInEnhetQuery(bruker?.ansattEnhet.id ?? skipToken);
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