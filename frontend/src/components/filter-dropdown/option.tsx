import React, { useEffect } from 'react';
import styled from 'styled-components';
import { StyledCheckbox } from '../../styled-components/checkbox';

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
  const ref = React.useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [focused]);

  return (
    <StyledLabel ref={ref} title={children}>
      <StyledCheckbox
        data-testid="filter"
        data-filterid={filterId}
        data-label={children}
        type="checkbox"
        checked={active}
        onChange={(event) => onChange(filterId, event.target.checked)}
        theme={{ focused }}
      />
      <StyledText>{children}</StyledText>
    </StyledLabel>
  );
};

Filter.displayName = 'Filter';

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 400;
  user-select: none;
  flex-wrap: nowrap;
  white-space: nowrap;
  word-break: keep-all;
  overflow: hidden;
  text-align: left;

  &:hover {
    color: #0067c5;
  }
`;

const StyledText = styled.span`
  width: 100%;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
