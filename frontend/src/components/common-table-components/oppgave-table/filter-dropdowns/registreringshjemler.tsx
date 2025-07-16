import { useOppgaveTableRegistreringshjemler } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { GroupedFilterList, type OptionGroup } from '@app/components/filter-dropdown/grouped-filter-list';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useLovKildeToRegistreringshjemler } from '@app/simple-api-state/use-kodeverk';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import { useMemo, useRef, useState } from 'react';
import type { FilterDropdownProps } from './types';

export const Registreringshjemler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLTableCellElement>(null);
  const { data: hjemler = [] } = useLovKildeToRegistreringshjemler();
  const [registreringshjemler, setRegistreringshjemler] = useOppgaveTableRegistreringshjemler(tableKey);

  const options: OptionGroup<string>[] = useMemo(
    () =>
      hjemler.map(({ id, navn, registreringshjemler }) => ({
        sectionHeader: { id, name: navn },
        sectionOptions: registreringshjemler.map((r) => ({ value: r.id, label: r.navn })),
      })),
    [hjemler],
  );

  useOnClickOutside(ref, () => setOpen(false), true);

  const toggleOpen = () => setOpen(!open);
  const close = () => setOpen(false);

  const chevron = open ? <ChevronUpIcon aria-hidden fontSize={20} /> : <ChevronDownIcon aria-hidden fontSize={20} />;

  return (
    <Table.ColumnHeader className="relative" ref={ref}>
      <ToggleButton onClick={toggleOpen} data-testid="lovhjemmel-button" $open={open}>
        {TABLE_HEADERS[columnKey]} ({registreringshjemler?.length ?? 0}) {chevron}
      </ToggleButton>

      {open ? (
        <GroupedFilterList
          data-testid="filter-hjemler"
          selected={registreringshjemler ?? []}
          options={options}
          onChange={setRegistreringshjemler}
          close={close}
          showFjernAlle
          testType="oppgave-list-filter-registreringshjemler"
        />
      ) : null}
    </Table.ColumnHeader>
  );
};
