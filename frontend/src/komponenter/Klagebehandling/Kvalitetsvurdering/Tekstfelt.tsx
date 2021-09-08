import React from 'react';
import { TextareaControlled } from 'nav-frontend-skjema';

interface ITekstfelt {
  defaultValue: string;
  label: string;
  placeholder: string;
  handleChange: Function;
}

export function Tekstfelt({ defaultValue, handleChange, label, placeholder }: ITekstfelt) {
  return (
    <TextareaControlled
      data-testid="tekst"
      placeholder={placeholder}
      defaultValue={defaultValue}
      label={label}
      onBlur={(e) => handleChange(e.target.value)}
      maxLength={0}
      style={{
        minHeight: '80px',
      }}
    />
  );
}
