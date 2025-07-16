import { StaticDataContext } from '@app/components/app/static-data-context';
import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/helpers';
import { useOppgaveTableMedunderskrivere } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import type { IOption } from '@app/components/filter-dropdown/props';
import { useGetMedunderskrivereForEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Table } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';
import type { FilterDropdownProps } from './types';

export const Medunderskriver = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { user } = useContext(StaticDataContext);
  const { data } = useGetMedunderskrivereForEnhetQuery(user.ansattEnhet.id);
  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.medunderskrivere), [data]);
  const [medunderskrivere, setMedunderskrivere] = useOppgaveTableMedunderskrivere(tableKey);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={medunderskrivere ?? []}
        onChange={setMedunderskrivere}
        options={options}
        data-testid="filter-medunderskriver"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
