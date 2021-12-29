import React, { useEffect } from 'react';
import styled from 'styled-components';
import { StyledCheckbox } from '../../styled-components/checkbox';

interface FilterProps<T extends string> {
  onChange: (id: T | null, active: boolean) => void;
  active: boolean;
  filterId?: T | null;
  children: string;
  focused: boolean;
}

export const Filter = <T extends string>({
  active,
  filterId = null,
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
    <StyledLabel ref={ref}>
      <StyledCheckbox
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
  white-space: 'nowrap';
  word-break: keep-all;
  overflow: hidden;

  &:hover {
    color: #0067c5;
  }
`;

const StyledText = styled.span`
  width: 100%;
  margin-left: 8px;
`;
