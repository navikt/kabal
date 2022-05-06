import { Datepicker } from 'nav-datovelger';
import { DatepickerChange, DatepickerProps } from 'nav-datovelger/lib/Datepicker';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ErrorMessage } from '../error-message/error-message';
import { StyledHelpText } from '../kvalitetsvurdering/styled-components';

const StyledLabelText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledErrorLabel = styled.label`
  .nav-datovelger {
    border: 1px solid #ba3a26;
    box-shadow: 0 0 0 1px #ba3a26;
    border-radius: 4px;
  }

  .nav-datovelger__input {
    border: none;
  }

  .nav-datovelger__kalenderknapp {
    border-right: none;
    border-top: none;
    border-bottom: none;
  }

  .nav-datovelger__kalenderknapp {
    min-height: 38px;
  }
`;

export interface DateTimePickerProps extends DatepickerProps, HelpTextProps {
  label: string;
  error?: string;
  onChange: (date: string | null) => void;
}

export const DatepickerWithError = ({ label, error, onChange, helpText, ...props }: DateTimePickerProps) => {
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

  return (
    <Label>
      <StyledLabelText>
        {label}
        <HelpText helpText={helpText} />
      </StyledLabelText>
      <Datepicker {...props} value={value} onChange={onChangeWithValidation} />
      <ErrorMessage error={error ?? inputError} />
    </Label>
  );
};

interface HelpTextProps {
  helpText?: string;
}

const HelpText = ({ helpText }: HelpTextProps) => {
  if (typeof helpText === 'undefined') {
    return null;
  }

  return <StyledHelpText>{helpText}</StyledHelpText>;
};

interface LabelProps {
  error?: string;
  inputError?: string;
  children: React.ReactNode;
}

const Label = ({ children, error, inputError }: LabelProps) => {
  if (typeof error !== 'undefined' || typeof inputError !== 'undefined') {
    return <StyledErrorLabel>{children}</StyledErrorLabel>;
  }

  return <label>{children}</label>;
};
