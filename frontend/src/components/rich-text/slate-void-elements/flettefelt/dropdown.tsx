import React from 'react';
import styled from 'styled-components';
import { Flettefelt } from '../../types/editor-void-types';
import { DropdownButton } from './dropdown-button';

interface Props {
  options: Flettefelt[];
  field: Flettefelt | null;
  focused: number;
  isOpen: boolean;
  setField: (field: Flettefelt) => void;
}

export const Dropdown = ({ isOpen, options, focused, field, setField }: Props) => {
  if (!isOpen) {
    return null;
  }

  return (
    <StyledDropdown>
      {options.map((k, i) => (
        <li key={k}>
          <DropdownButton field={k} onClick={() => setField(k)} isActive={k === field} isFocused={focused === i} />
        </li>
      ))}
    </StyledDropdown>
  );
};

const StyledDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #fff;
  border-radius: 4px;
  z-index: 3;
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
`;
