import { useOppgaveTableRegistreringshjemler } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SelectHjemler } from '@app/components/filter-dropdown/select-hjemler';
import { useLovKildeToRegistreringshjemler } from '@app/simple-api-state/use-kodeverk';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

export const Registreringshjemler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data: hjemler = [] } = useLovKildeToRegistreringshjemler();
  const [registreringshjemler, setRegistreringshjemler] = useOppgaveTableRegistreringshjemler(tableKey);

  return (
    <Table.ColumnHeader className="relative" aria-sort="none">
      <SelectHjemler
        selectedHjemler={registreringshjemler ?? []}
        setSelectedHjemler={setRegistreringshjemler}
        options={hjemler}
        label={TABLE_HEADERS[columnKey]}
        variant="tertiary-neutral"
      />
    </Table.ColumnHeader>
  );
};
