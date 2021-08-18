import React from "react";
import { TextareaControlled } from "nav-frontend-skjema";

interface ITekstfelt {
  defaultValue: string;
  label: string;
  handleChange: Function;
}

export function Tekstfelt({ defaultValue, handleChange, label }: ITekstfelt) {
  return (
    <TextareaControlled
      data-testid="tekst"
      defaultValue={defaultValue}
      label={label}
      onBlur={(e) => handleChange(e.target.value)}
      maxLength={0}
      style={{
        minHeight: "80px",
      }}
    />
  );
}
