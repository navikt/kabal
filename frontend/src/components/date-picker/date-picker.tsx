import { DatePicker as DSDatePicker, DateInputProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { ISO_DATE_FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { prettyDateToISO } from '@app/domain/date';
import { parseUserInput } from './parse-user-input';

interface Props {
  centuryThreshold?: number;
  disabled?: boolean;
  error?: string;
  fromDate?: Date;
  id?: string;
  label: React.ReactNode;
  onChange: (date: string | null) => void;
  size?: DateInputProps['size'];
  toDate?: Date;
  value?: Date;
  warningThreshhold?: Date;
  className?: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
}

const DEFAULT_FROM_DATE = new Date(1970);

export const DatePicker = ({
  disabled,
  error,
  fromDate = DEFAULT_FROM_DATE,
  id,
  label,
  onChange,
  toDate = new Date(),
  value = undefined,
  size,
  centuryThreshold = 50,
  className,
  hideLabel,
  autoFocus,
}: Props) => {
  const [input, setInput] = useState<string>(value === undefined ? '' : format(value, PRETTY_FORMAT));

  useEffect(() => {
    setInput(value === undefined ? '' : format(value, PRETTY_FORMAT));
  }, [value]);

  const onDateChange = useCallback(
    (dateObject?: Date) => {
      if (dateObject === undefined) {
        return onChange(null);
      }

      const prettyFormatted = format(dateObject, PRETTY_FORMAT);

      if (prettyFormatted !== input) {
        const isoFormatted = format(dateObject, ISO_DATE_FORMAT);
        onChange(isoFormatted);
      }
    },
    [input, onChange],
  );

  const [month, setMonth] = useState(value);

  const onBlur = useCallback(() => {
    if (input === '') {
      onChange(null);

      return;
    }

    requestAnimationFrame(() => {
      const dateString = parseUserInput(input, fromDate, toDate, centuryThreshold);

      onChange(dateString === null ? null : prettyDateToISO(dateString));
      setInput(dateString);
    });
  }, [centuryThreshold, fromDate, input, onChange, toDate]);

  return (
    <DSDatePicker
      mode="single"
      data-testid={id}
      fromDate={fromDate}
      toDate={toDate}
      defaultSelected={value}
      selected={value}
      onSelect={onDateChange}
      locale="nb"
      dropdownCaption
      month={month}
      onMonthChange={setMonth}
      onOpenToggle={() => setMonth(value)}
      className={className}
    >
      <DSDatePicker.Input
        id={id}
        error={error}
        label={label}
        disabled={disabled}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        onBlur={onBlur}
        size={size}
        autoFocus={autoFocus}
        hideLabel={hideLabel}
      />
    </DSDatePicker>
  );
};
