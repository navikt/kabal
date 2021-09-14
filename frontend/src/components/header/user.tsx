import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useGetBrukerQuery, useGetEnheterQuery, useGetValgtEnhetQuery } from '../../redux-api/bruker';

export const User = () => {
  const { data: bruker } = useGetBrukerQuery();
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.id ?? skipToken);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (typeof bruker === 'undefined') {
    return <StyledContainer>Laster...</StyledContainer>;
  }

  return (
    <StyledContainer>
      <StyledButton onClick={() => setIsOpen(!isOpen)}>{bruker?.displayName}</StyledButton>
      <Dropdown open={isOpen} brukerId={bruker.id} />
    </StyledContainer>
  );
};

interface DropdownProps {
  open: boolean;
  brukerId: string;
}

const Dropdown: React.FC<DropdownProps> = ({ open, brukerId }) => {
  const { data: enheter } = useGetEnheterQuery(brukerId ?? skipToken);
  if (!open || typeof enheter === 'undefined') {
    return null;
  }
  return (
    <StyledDropdown>
      {enheter.map(({ id, navn }) => (
        <Enhet key={id}>
          <EnhetButton>
            {id} {navn}
          </EnhetButton>
        </Enhet>
      ))}
    </StyledDropdown>
  );
};

const StyledContainer = styled.div`
  position: relative;
`;

const StyledButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0.5em;
  color: white;
`;

const StyledDropdown = styled.ul`
  position: absolute;
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  left: 0;
  background-color: white;
`;

const Enhet = styled.li`
  display: block;
  width: 100%;
`;

const EnhetButton = styled.button`
  display: block;
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0.5em;

  &:hover {
    background-color: lightgrey;
  }
`;
