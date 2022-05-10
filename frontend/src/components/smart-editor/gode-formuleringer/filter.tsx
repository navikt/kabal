import { TextField } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';

interface Props {
  isFocused: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  onFocus: () => void;
}

export const Filter = ({ isFocused, filter, setFilter, onFocus }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      if (inputRef.current !== null) {
        inputRef.current.focus();
      }
    }
  }, [isFocused]);

  return (
    <TextField
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      onFocus={onFocus}
      size="small"
      label="Filtrer på tittel"
      placeholder="Filtrer på tittel"
      hideLabel
      autoFocus
      ref={inputRef}
    />
  );
};
