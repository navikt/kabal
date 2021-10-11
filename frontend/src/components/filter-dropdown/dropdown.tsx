import Knapp from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { IKodeverkVerdi } from '../../tilstand/moduler/kodeverk';
import { Filter } from './option';

interface DropdownProps {
  selected: string[];
  options: IKodeverkVerdi[];
  onChange: (id: string | null, active: boolean) => void;
  open: boolean;
}

export const Dropdown = ({ selected, options, open, onChange }: DropdownProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  const reset = () => {
    onChange(null, false);
  };

  return (
    <StyledList>
      <StyledTopListItem>
        <Knapp mini onClick={reset}>
          Nullstill
        </Knapp>
      </StyledTopListItem>
      {options.map(({ id, beskrivelse }) => (
        <StyledListItem key={id}>
          <Filter active={selected.includes(id)} filterId={id} onChange={onChange}>
            {beskrivelse}
          </Filter>
        </StyledListItem>
      ))}
    </StyledList>
  );
};

const StyledList = styled.ul`
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  min-width: 100%;
  list-style: none;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  max-height: calc(100vh - 20em);
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  z-index: 1;
`;

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
  width: 100%;
`;

const StyledTopListItem = styled(StyledListItem)`
  border-bottom: 1px solid #c6c2bf;
  background-color: white;
  padding: 8px;
`;
