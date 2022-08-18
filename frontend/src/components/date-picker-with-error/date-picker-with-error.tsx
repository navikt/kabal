import { Datepicker } from '@navikt/ds-datepicker';
import { DatepickerChange, DatepickerProps } from '@navikt/ds-datepicker/lib/Datepicker';
import '@navikt/ds-datepicker/lib/index.css';
import React, { useState } from 'react';
import { ErrorMessage } from '../error-message/error-message';

export interface DateTimePickerProps extends DatepickerProps {
  error?: string;
  onChange: (date: string | null) => void;
}

export const DatepickerWithError = ({ error, onChange, ...props }: DateTimePickerProps) => {
  const [inputError, setInputError] = useState<string>();
  const [value, setValue] = useState(props.value);

  const onChangeWithValidation: DatepickerChange = (newValue, isValidISODateString) => {
    setValue(newValue);

    if (newValue.length === 0) {
      onChange(null);
      setInputError(undefined);
      return;
    }

    if (isValidISODateString) {
      onChange(newValue);
      setInputError(undefined);
      return;
    }

    setInputError('Dato må være på formen DD.MM.ÅÅÅÅ');
  };

  const children = (
    <>
      <Datepicker {...props} value={value} onChange={onChangeWithValidation} />
      <ErrorMessage error={error ?? inputError} />
    </>
  );

  if (typeof error !== 'undefined' || typeof inputError !== 'undefined') {
    return <label>{children}</label>;
  }

  return <label>{children}</label>;
};
