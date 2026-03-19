import { HStack } from '@navikt/ds-react';
import { formatISO, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { DatePickerRange } from '@/components/date-picker-range/date-picker-range';
import type { Fields } from '@/components/documents/journalfoerte-documents/grid';
import { SortButton, type SortButtonProps } from '@/components/documents/journalfoerte-documents/header/sort-button';
import type { DateRangeSetting } from '@/hooks/settings/use-setting';

export interface DateFilterProps extends DateRangeSetting, SortButtonProps {
  label: string;
  gridArea: Fields;
}

export const DateFilter = ({
  value,
  setValue,
  remove,
  sort,
  setSort,
  label,
  gridArea,
  column,
  size,
}: DateFilterProps) => {
  const [fromDateString, toDateString] = value;

  const from = fromDateString === null ? undefined : formatISO(parseISO(fromDateString), { representation: 'date' });
  const to = toDateString === null ? undefined : formatISO(parseISO(toDateString), { representation: 'date' });

  const onChange = (range: DateRange | undefined) => {
    if (range === undefined) {
      return remove();
    }

    const newFrom = range.from === undefined ? null : formatISO(range.from, { representation: 'date' });
    const newTo = range.to === undefined ? null : formatISO(range.to, { representation: 'date' });

    setValue([newFrom, newTo]);
  };

  return (
    <HStack align="center" as="section" style={{ gridArea }} wrap={false}>
      <SortButton column={column} sort={sort} setSort={setSort} size={size} />
      <DatePickerRange onChange={onChange} selected={{ from, to }} buttonLabel={label} buttonSize={size} />
    </HStack>
  );
};
