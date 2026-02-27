import { useOppgaveTableTyper } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { type FilterType, FlatMultiSelectDropdown } from '@app/components/filter-dropdown/multi-select-dropdown';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

const OPTIONS = [
  { value: SaksTypeEnum.KLAGE, label: 'Klage' },
  { value: SaksTypeEnum.ANKE, label: 'Anke' },
  { value: SaksTypeEnum.OMGJØRINGSKRAV, label: 'Omgjøringskrav' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK, label: 'Begjæring om gjenopptak' },
];

export const Sakstype = (props: FilterDropdownProps) => <Filter {...props} options={OPTIONS} />;

export const SakstypeWithTrygderetten = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    options={[...OPTIONS, { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i Trygderetten' }]}
  />
);

export const SakertypeForSakerITR = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    options={[
      { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i Trygderetten' },
      { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, label: 'Begjæring om gjenopptak i TR' },
    ]}
  />
);

const Filter = ({ columnKey, tableKey, options }: FilterDropdownProps & { options: FilterType<SaksTypeEnum>[] }) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FlatMultiSelectDropdown<SaksTypeEnum>
        selected={typer ?? []}
        onChange={setTyper}
        options={options}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FlatMultiSelectDropdown>
    </Table.ColumnHeader>
  );
};
