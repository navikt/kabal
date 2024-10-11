import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import type { IOption } from '@app/components/filter-dropdown/props';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { Table } from '@navikt/ds-react';
import { useMemo } from 'react';
import type { FilterDropdownProps } from './types';

export const RolHjemmel = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data: ytelser = [] } = useLatestYtelser();

  const options = useMemo<IOption<string>[]>(() => {
    const o: IOption<string>[] = [];

    for (const { innsendingshjemler } of ytelser) {
      for (const { id, navn } of innsendingshjemler) {
        if (o.find((e) => e.value === id) === undefined) {
          o.push({ value: id, label: navn });
        }
      }
    }

    return o.sort((a, b) => sortWithOrdinals(a.label, b.label));
  }, [ytelser]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.hjemler ?? []}
        onChange={(hjemler) => setParams({ ...params, hjemler })}
        options={options}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
