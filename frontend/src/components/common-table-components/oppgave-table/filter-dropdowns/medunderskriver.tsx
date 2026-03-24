import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableMedunderskrivere } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useGetMedunderskrivereForEnhetQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import type { INavEmployee } from '@/types/bruker';

const toEmployeeEntry = (e: INavEmployee): Entry<INavEmployee> => ({
  value: e,
  key: e.navIdent,
  label: (
    <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
      <span>{e.navn}</span>
      <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
        {e.navIdent}
      </Tag>
    </div>
  ),
  plainText: `${e.navn} ${e.navIdent}`,
});

export const Medunderskriver = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { user } = useContext(StaticDataContext);
  const { data } = useGetMedunderskrivereForEnhetQuery(user.ansattEnhet.id);
  const [medunderskrivere, setMedunderskrivere] = useOppgaveTableMedunderskrivere(tableKey);

  const options = useMemo<Entry<INavEmployee>[]>(() => (data?.medunderskrivere ?? []).map(toEmployeeEntry), [data]);

  const selectedEntries = useMemo(
    () => options.filter((entry) => medunderskrivere?.includes(entry.key) === true),
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
