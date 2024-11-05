import { FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { getFullYear, isDateParts, isEightChars, isFourChars, isSixChars } from '@app/components/date-picker/helpers';
import { Warning } from '@app/components/date-picker/warning';
import { isoDateToPretty } from '@app/domain/date';
import { DatePicker as DSDatePicker } from '@navikt/ds-react';
import { addYears, format, isAfter, isBefore, isValid, parse, subDays, subYears } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  centuryThreshold?: number;
  disabled?: boolean;
  error?: string;
  fromDate?: Date;
  id?: string;
  label: React.ReactNode;
  onChange: (date: string | null) => void;
  size: 'small' | 'medium';
  toDate?: Date;
  value: string | null;
  warningThreshhold?: Date;
  className?: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
}

export const DatePicker = ({
  disabled,
  error,
  fromDate = new Date(1970),
  id,
  label,
  onChange,
  toDate = new Date(),
  value,
  size,
  centuryThreshold = 50,
  warningThreshhold,
  className,
  hideLabel,
  autoFocus,
}: Props) => {
  const [inputError, setInputError] = useState<string>();
  const [input, setInput] = useState<string>(value === null ? '' : (isoDateToPretty(value) ?? ''));

  useEffect(() => {
    setInput(value === null ? '' : (isoDateToPretty(value) ?? ''));
    setInputError(undefined);
  }, [value]);

  const selected = useMemo(() => (value === null ? undefined : parse(value, FORMAT, new Date())), [value]);

  const onDateChange = (date?: Date) => {
    setInputError(undefined);

    if (date === undefined) {
      onChange(null);
    } else {
      onChange(format(date, FORMAT));
    }
  };

  const [month, setMonth] = useState(selected);

  const validateInput = useCallback(
    (fullInput: string) => {
      const date = parse(fullInput, PRETTY_FORMAT, new Date());
      const validFormat = isValid(date);
      const validRange = isAfter(date, subDays(fromDate, 1)) && isBefore(date, toDate);

      if (!validFormat) {
        setInputError('Ugyldig dato');

        return;
      }

      if (!validRange) {
        setInputError(`Dato må være mellom ${format(fromDate, PRETTY_FORMAT)} og ${format(toDate, PRETTY_FORMAT)}`);

        return;
      }

      setInputError(undefined);
      onChange(format(date, FORMAT));
    },
    [fromDate, onChange, toDate],
  );

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const onInputChange = useCallback(() => {
    if (input === '') {
      setInputError(undefined);
      onChange(null);

      return;
    }

    const parts = input.split('.');

    // Prefix with reasonable century, e.g. 20 for 2022 and 19 for 1999.
    if (isDateParts(parts)) {
      const [dd, mm, yy] = parts;
      const date = `${dd.padStart(2, '0')}.${mm.padStart(2, '0')}.${getFullYear(yy, centuryThreshold)}`;
      setInput(date);
      requestAnimationFrame(() => validateInput(date));

      return;
    }

    const chars = input.split('');

    // 211220 -> 21.12.2020
    if (isSixChars(chars)) {
      const [d1, d2, m1, m2, y1, y2] = chars;
      const date = `${d1}${d2}.${m1}${m2}.${getFullYear(`${y1}${y2}`, centuryThreshold)}`;
      setInput(date);
      requestAnimationFrame(() => validateInput(date));

      return;
    }

    // 31122020 -> 31.12.2020
    if (isEightChars(chars)) {
      const [d1, d2, m1, m2, y1, y2, y3, y4] = chars;
      const date = `${d1}${d2}.${m1}${m2}.${y1}${y2}${y3}${y4}`;
      setInput(date);
      requestAnimationFrame(() => validateInput(date));

      return;
    }

    // Current year if the date is in the past, otherwise previous year.
    // 3112 -> 31.12.2021
    if (isFourChars(chars)) {
      const [d1, d2, m1, m2] = chars;
      const dateObject = parse(`${d1}${d2}.${m1}${m2}`, 'dd.MM', new Date());

      if (!isValid(dateObject)) {
        validateInput(input);

        return;
      }

      if (isAfter(dateObject, toDate)) {
        const date = format(subYears(dateObject, 1), PRETTY_FORMAT);
        setInput(date);
        requestAnimationFrame(() => validateInput(date));

        return;
      }

      if (isBefore(dateObject, fromDate)) {
        const date = format(addYears(dateObject, 1), PRETTY_FORMAT);
        setInput(date);
        requestAnimationFrame(() => validateInput(date));

        return;
      }

      const date = format(dateObject, PRETTY_FORMAT);
      setInput(date);
      requestAnimationFrame(() => validateInput(date));

      return;
    }

    validateInput(input);
  }, [centuryThreshold, fromDate, input, onChange, toDate, validateInput]);

  return (
    <DSDatePicker
      mode="single"
      data-testid={id}
      fromDate={fromDate}
      toDate={toDate}
      defaultSelected={selected}
      selected={selected}
      onSelect={onDateChange}
      locale="nb"
      dropdownCaption
      month={month}
      onMonthChange={setMonth}
      onOpenToggle={() => setMonth(selected)}
      className={className}
    >
      <DSDatePicker.Input
        id={id}
        error={error ?? inputError}
        label={label}
        disabled={disabled}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        onBlur={onInputChange}
        size={size}
        hideLabel={hideLabel}
        autoFocus={autoFocus}
      />
      <Warning date={selected} threshhold={warningThreshhold} />
    </DSDatePicker>
  );
};
