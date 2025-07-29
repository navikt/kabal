import type { CountryCode } from '@app/types/common';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface Props {
  country: CountryCode;
  isFocused: boolean;
  isSelected: boolean;
  onClick: (country: CountryCode) => void;
}

export const Option = ({ country, isFocused, isSelected, onClick }: Props) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isFocused && ref.current !== null) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isFocused]);

  return (
    <li key={country.landkode} ref={ref}>
      <Button
        size="small"
        variant={isFocused ? 'primary' : 'tertiary-neutral'}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onClick(country)}
        icon={isSelected ? <CheckmarkIcon aria-hidden /> : null}
        className="w-full justify-start"
      >
        {country.land} ({country.landkode})
      </Button>
    </li>
  );
};
