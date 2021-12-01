import React, { useEffect } from 'react';
import { useOnMount } from '../../../hooks/use-on-mount';
import { usePrevious } from '../../../hooks/use-previous';
import { StyledInput } from './text-input';

interface Props {
  placeholder: string;
  title: string;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

export const AutofillInput = ({ placeholder, title, value, defaultValue, onChange }: Props) => {
  const previousDefaultValue = usePrevious(defaultValue);

  useEffect(() => {
    if (typeof previousDefaultValue !== 'undefined' && previousDefaultValue !== defaultValue) {
      onChange(defaultValue);
    }
  }, [onChange, previousDefaultValue, defaultValue]);

  useOnMount(() => {
    if (value.length === 0) {
      onChange(defaultValue);
    }
  });

  return (
    <StyledInput
      type="text"
      placeholder={placeholder}
      title={title}
      value={value}
      onChange={({ target }) => onChange(target.value)}
    />
  );
};
