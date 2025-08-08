import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import type { DateRangeSetting } from '@app/hooks/settings/use-setting';
import { formatISO, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { Fields } from '../grid';

interface Props extends DateRangeSetting {
  label: string;
  gridArea: Fields;
}

export const DateFilter = ({ value, setValue, remove, label, gridArea }: Props) => {
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
    <DatePickerRange
      onChange={onChange}
      selected={{ from, to }}
      buttonLabel={label}
      gridArea={gridArea}
      buttonSize="small"
    />
  );
};
