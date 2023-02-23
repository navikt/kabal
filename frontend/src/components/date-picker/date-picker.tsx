import { DateInputProps, UNSAFE_DatePicker as Datepicker } from '@navikt/ds-react';
import { clamp, format, parse } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isoDateToPretty, prettyDateToISO } from '../../domain/date';
import { ISO_FORMAT, PRETTY_FORMAT } from './constants';
import { parseUserInput } from './parse-user-input';
import { validateDateString } from './validate';

interface Props {
  disabled?: boolean;
  hideLabel?: boolean;
  error?: string;
  fromDate?: Date;
  id: string;
  label: React.ReactNode;
  toDate?: Date;
  value: string | null;
  size: DateInputProps['size'];
  centuryThreshold?: number;
  onChange: (date: string | null) => void;
  autoFocus?: boolean;
}

export const DatePicker = ({
  disabled,
  hideLabel = false,
  error,
  id,
  label,
  onChange,
  fromDate = new Date(1970),
  toDate = new Date(),
  value,
  size,
  centuryThreshold = 50,
  autoFocus = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputError, setInputError] = useState<string>();
  const [input, setInput] = useState<string>(value === null ? '' : isoDateToPretty(value) ?? '');

  const defaultDate = useMemo(() => clamp(new Date(), { start: fromDate, end: toDate }), [fromDate, toDate]);

  useEffect(() => {
    setInput(value === null ? '' : isoDateToPretty(value) ?? '');
    setInputError(undefined);
  }, [value]);

  const selected = useMemo(
    () => (value === null ? undefined : parse(value, ISO_FORMAT, defaultDate)),
    [defaultDate, value]
  );

  const [month, setMonth] = useState(selected);

  const validateInput = useCallback(
    (dateString: string) => {
      const validationError = validateDateString({ dateString, fromDate, toDate, defaultDate });
      setInputError(validationError);

      return validationError === undefined;
    },
    [defaultDate, fromDate, toDate]
  );

  const onToggle = useCallback(() => setIsOpen((o) => !o), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  const validateAndCommit = useCallback(
    (userInput: string) => {
      setInputError(undefined);

      const prettyDate = parseUserInput({ userInput, centuryThreshold, fromDate, toDate });
      const isoDate = prettyDateToISO(prettyDate);

      if (validateInput(prettyDate) && isoDate !== value) {
        setIsOpen(false);
        setTimeout(() => {
          onChange(isoDate);
        });
      }
    },
    [centuryThreshold, fromDate, value, onChange, toDate, validateInput]
  );

  const onBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => validateAndCommit(target.value),
    [validateAndCommit]
  );

  const onDateChange = useCallback(
    (dateObject?: Date) => {
      setIsOpen(false);
      setInputError(undefined);
      const prettyDate =
        dateObject === undefined ? format(selected ?? defaultDate, PRETTY_FORMAT) : format(dateObject, PRETTY_FORMAT);
      setInput(prettyDate);

      setTimeout(() => {
        if (validateInput(prettyDate)) {
          const isoDate = prettyDateToISO(prettyDate) ?? '';
          onChange(isoDate);
        }
      });
    },
    [defaultDate, onChange, selected, validateInput]
  );

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        validateAndCommit(event.currentTarget.value);

        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        setInput(value === null ? '' : isoDateToPretty(value) ?? '');
      }
    },
    [validateAndCommit, value]
  );

  const parsedInput = useMemo(() => parse(input, PRETTY_FORMAT, defaultDate), [defaultDate, input]);

  return (
    <Datepicker
      mode="single"
      data-testid={id}
      fromDate={fromDate}
      toDate={toDate}
      defaultSelected={selected}
      selected={parsedInput}
      onSelect={onDateChange}
      locale="nb"
      dropdownCaption
      month={month}
      onMonthChange={setMonth}
      onOpenToggle={onToggle}
      onClose={onClose}
      open={isOpen}
    >
      <Datepicker.Input
        id={id}
        label={label}
        hideLabel={hideLabel}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        error={error ?? inputError}
        size={size}
        onBlur={onBlur}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </Datepicker>
  );
};
