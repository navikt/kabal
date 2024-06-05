import { Search } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface Props {
  isFocused: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  onFocus: () => void;
}

const LABEL = 'Filtrer på innhold';

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
    <Search
      value={filter}
      onChange={setFilter}
      onFocus={onFocus}
      size="small"
      variant="simple"
      label={LABEL}
      placeholder={LABEL}
      hideLabel
      autoFocus
      ref={inputRef}
    />
  );
};
