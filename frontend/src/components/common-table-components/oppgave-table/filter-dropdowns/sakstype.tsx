import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

const OPTIONS = [
  { value: SaksTypeEnum.KLAGE, label: 'Klage' },
  { value: SaksTypeEnum.ANKE, label: 'Anke' },
  { value: SaksTypeEnum.OMGJØRINGSKRAV, label: 'Omgjøringskrav' },
];

export const Sakstype = ({ params, setParams, columnKey }: FilterDropdownProps) => (
  <Table.ColumnHeader>
    <FilterDropdown<SaksTypeEnum>
      selected={params.typer ?? []}
      onChange={(typer) => setParams({ ...params, typer })}
      options={OPTIONS}
      data-testid="filter-type"
    >
      {TABLE_HEADERS[columnKey]}
    </FilterDropdown>
  </Table.ColumnHeader>
);

export const SakstypeWithAnkeITrygderetten = ({ params, setParams, columnKey }: FilterDropdownProps) => (
  <Table.ColumnHeader>
    <FilterDropdown<SaksTypeEnum>
      selected={params.typer ?? []}
      onChange={(typer) => setParams({ ...params, typer })}
      options={[...OPTIONS, { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i Trygderetten' }]}
      data-testid="filter-type"
    >
      {TABLE_HEADERS[columnKey]}
    </FilterDropdown>
  </Table.ColumnHeader>
);
