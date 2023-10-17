import { Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo } from 'react';
import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-drodowns/helpers';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { IOption } from '@app/components/filter-dropdown/props';
import { useGetMedunderskrivereForEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { FilterDropdownProps } from './types';

export const Medunderskriver = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data: bruker } = useUser();
  const { data } = useGetMedunderskrivereForEnhetQuery(bruker?.ansattEnhet.id ?? skipToken);
  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.medunderskrivere), [data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.medunderskrivere ?? []}
        onChange={(medunderskrivere) => setParams({ ...params, medunderskrivere })}
        options={options}
        data-testid="filter-medunderskriver"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
