import { Checkbox } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

interface FilterProps<T extends string> {
  onChange: (id: T, active: boolean) => void;
  active: boolean;
  filterId: T;
  children: string;
  focused: boolean;
}

export const Filter = <T extends string>({
  active,
  filterId,
  children,
  onChange,
  focused,
}: FilterProps<T>): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [focused]);

  return (
    <StyledCheckbox
      data-testid="filter"
      data-filterid={filterId}
      data-label={children}
      type="checkbox"
      checked={active}
      onChange={(event) => onChange(filterId, event.target.checked)}
      size="small"
      ref={ref}
      title={children}
    >
      <span title={children}>{children}</span>
    </StyledCheckbox>
  );
};

Filter.displayName = 'Filter';

const StyledCheckbox = styled(Checkbox)`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;
