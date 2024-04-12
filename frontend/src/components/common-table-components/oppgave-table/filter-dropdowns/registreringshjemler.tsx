import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import React, { useMemo, useRef, useState } from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { GroupedFilterList, OptionGroup } from '@app/components/filter-dropdown/grouped-filter-list';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useLovKildeToRegistreringshjemler } from '@app/simple-api-state/use-kodeverk';
import { LovkildeToRegistreringshjemmelFilter } from '@app/types/oppgaver';
import { FilterDropdownProps } from './types';

interface Props extends FilterDropdownProps {
  options: LovkildeToRegistreringshjemmelFilter[];
}

export const Registreringshjemler = ({ params, setParams, columnKey, options }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLTableCellElement>(null);
  const { data: lovkildeToRegistreringshjemler = [] } = useLovKildeToRegistreringshjemler();

  const filterOptions: OptionGroup<string>[] = useMemo(
    () =>
      options.map(({ lovkildeId, registreringshjemmelIdList }) => {
        const lovkilde = lovkildeToRegistreringshjemler.find(({ id }) => id === lovkildeId);

        if (lovkilde === undefined) {
          return {
            sectionHeader: { id: lovkildeId, name: lovkildeId },
            sectionOptions: [],
          };
        }

        return {
          sectionHeader: { id: lovkildeId, name: lovkilde.navn },
          sectionOptions: registreringshjemmelIdList.map((value) => ({
            value,
            label: lovkilde.registreringshjemler.find((rh) => rh.id === value)?.navn ?? value,
          })),
        };
      }),
    [lovkildeToRegistreringshjemler, options],
  );

  useOnClickOutside(ref, () => setOpen(false), true);

  const toggleOpen = () => setOpen(!open);
  const close = () => setOpen(false);

  const chevron = open ? <ChevronUpIcon aria-hidden fontSize={20} /> : <ChevronDownIcon aria-hidden fontSize={20} />;

  return (
    <Table.ColumnHeader style={{ position: 'relative' }} ref={ref}>
      <ToggleButton onClick={toggleOpen} data-testid="lovhjemmel-button" $open={open}>
        {TABLE_HEADERS[columnKey]} ({params.hjemler?.length ?? 0}) {chevron}
      </ToggleButton>

      <GroupedFilterList
        data-testid="filter-hjemler"
        selected={params.registreringshjemler ?? []}
        options={filterOptions}
        open={open}
        onChange={(registreringshjemler) => setParams({ ...params, registreringshjemler })}
        close={close}
        showFjernAlle
        testType="oppgave-list-filter-registreringshjemler"
      />
    </Table.ColumnHeader>
  );
};
