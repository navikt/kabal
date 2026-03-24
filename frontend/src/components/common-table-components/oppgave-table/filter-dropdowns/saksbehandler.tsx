import { Table, Tag } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTildelteSaksbehandlere } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useGetSaksbehandlereInEnhetQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import type { INavEmployee } from '@/types/bruker';

const toEntry = (e: INavEmployee): Entry<INavEmployee> => ({
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

export const Saksbehandler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { user } = useContext(StaticDataContext);
  const { data } = useGetSaksbehandlereInEnhetQuery(user.ansattEnhet.id);
  const employees = useMemo(() => data?.saksbehandlere ?? [], [data]);
  const [tildelteSaksbehandlere, setTildelteSaksbehandlere] = useOppgaveTableTildelteSaksbehandlere(tableKey);

  const options = useMemo(() => employees.map(toEntry), [employees]);

  const selectedEntries = useMemo(
    () => options.filter((entry) => tildelteSaksbehandlere?.includes(entry.key) === true),
    [options, tildelteSaksbehandlere],
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
