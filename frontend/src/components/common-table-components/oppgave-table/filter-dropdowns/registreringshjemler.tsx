import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import React, { useMemo, useRef, useState } from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { GroupedFilterList, OptionGroup } from '@app/components/filter-dropdown/grouped-filter-list';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useLovKildeToRegistreringshjemler } from '@app/simple-api-state/use-kodeverk';
import { FilterDropdownProps } from './types';

export const Registreringshjemler = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLTableCellElement>(null);
  const { data: hjemler = [] } = useLovKildeToRegistreringshjemler();

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
    <Table.ColumnHeader style={{ position: 'relative' }} ref={ref}>
      <ToggleButton onClick={toggleOpen} data-testid="lovhjemmel-button" $open={open}>
        {TABLE_HEADERS[columnKey]} ({params.registreringshjemler?.length ?? 0}) {chevron}
      </ToggleButton>

      {open ? (
        <GroupedFilterList
          data-testid="filter-hjemler"
          selected={params.registreringshjemler ?? []}
          options={options}
          onChange={(registreringshjemler) => setParams({ ...params, registreringshjemler })}
          close={close}
          showFjernAlle
          testType="oppgave-list-filter-registreringshjemler"
        />
      ) : null}
    </Table.ColumnHeader>
  );
};
