import { Table } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FilterDropdownProps } from './types';

interface Props extends FilterDropdownProps {
  options: SaksTypeEnum[];
}

export const Sakstype = ({ params, setParams, columnKey, options }: Props) => {
  const filterOptions = useMemo(() => options.map((o) => ({ value: o, label: getLabel(o) })), [options]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown<SaksTypeEnum>
        selected={params.typer ?? []}
        onChange={(typer) => setParams({ ...params, typer })}
        options={filterOptions}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

const getLabel = (value: SaksTypeEnum) => {
  switch (value) {
    case SaksTypeEnum.KLAGE:
      return 'Klage';
    case SaksTypeEnum.ANKE:
      return 'Anke';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'Anke i Trygderetten';
  }
};
