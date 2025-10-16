import { useOppgaveTableTyper } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

const OPTIONS = [
  { value: SaksTypeEnum.KLAGE, label: 'Klage' },
  { value: SaksTypeEnum.ANKE, label: 'Anke' },
  { value: SaksTypeEnum.OMGJØRINGSKRAV, label: 'Omgjøringskrav' },
  { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK, label: 'Begjæring om gjenopptak' },
];

export const Sakstype = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FilterDropdown<SaksTypeEnum>
        selected={typer ?? []}
        onChange={setTyper}
        options={OPTIONS}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const SakstypeWithTrygderetten = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FilterDropdown<SaksTypeEnum>
        selected={typer ?? []}
        onChange={setTyper}
        options={[
          ...OPTIONS,
          { value: SaksTypeEnum.ANKE_I_TRYGDERETTEN, label: 'Anke i Trygderetten' },
          { value: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, label: 'Begjæring om gjenopptak i Trygderetten' },
          { value: SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET, label: 'Behandling etter Trygderetten opphevet' },
        ]}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
