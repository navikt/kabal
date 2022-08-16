import { Datepicker } from '@navikt/ds-datepicker';
import { DatepickerChange, DatepickerProps } from '@navikt/ds-datepicker/lib/Datepicker';
import '@navikt/ds-datepicker/lib/index.css';
import React, { useState } from 'react';
import { InputError } from '../input-error/input-error';

interface Props extends DatepickerProps {
  error?: string;
  // TODO: Allow null when BE allows it
  onChange: (date: string /* | null*/) => void;
}

export const DatepickerWithError = ({ error, onChange, ...props }: Props) => {
  const [inputError, setInputError] = useState<string>();
  const [value, setValue] = useState(props.value);

  const onChangeWithValidation: DatepickerChange = (newValue, isValidISODateString) => {
    setValue(newValue);

    // TODO: Allow null when BE allows it
    // if (newValue.length === 0) {
    //   onChange(null);
    //   setInputError(undefined);

    //   return;
    // }

    if (isValidISODateString) {
      onChange(newValue);
      setInputError(undefined);

      return;
    }

    setInputError('Dato må være på formen DD.MM.ÅÅÅÅ');
  };

  return (
    <>
      <Datepicker {...props} value={value} onChange={onChangeWithValidation} />
      <InputError error={error ?? inputError} />
    </>
  );
};
