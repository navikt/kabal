import { formatISO, parseISO } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { useDocumentsFilterDato } from '@app/hooks/settings/use-setting';

export const DateFilter = () => {
  const { value, setValue, remove } = useDocumentsFilterDato();

  const [fromString, toString] = value;

  const from = fromString === null ? undefined : formatISO(parseISO(fromString), { representation: 'date' });
  const to = toString === null ? undefined : formatISO(parseISO(toString), { representation: 'date' });

  const onChange = (range: DateRange | undefined) => {
    if (range === undefined) {
      return remove();
    }

    const newFrom = range.from === undefined ? null : formatISO(range.from, { representation: 'date' });
    const newTo = range.to === undefined ? null : formatISO(range.to, { representation: 'date' });

    setValue([newFrom, newTo]);
  };

  return <DatePickerRange onChange={onChange} selected={{ from, to }} buttonLabel="Dato" />;
};
