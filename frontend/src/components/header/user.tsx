import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  useGetBrukerQuery,
  useGetEnheterQuery,
  useGetValgtEnhetQuery,
  useSetValgtEnhetMutation,
} from '../../redux-api/bruker';

export const User = () => {
  const { data: bruker } = useGetBrukerQuery();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (typeof bruker === 'undefined') {
    return <StyledContainer>Laster...</StyledContainer>;
  }

  return (
    <StyledContainer>
      <StyledButton onClick={() => setIsOpen(!isOpen)}>
        {bruker?.displayName}
        <DisplayEnhet brukerId={bruker.onPremisesSamAccountName} />
      </StyledButton>
      <Dropdown open={isOpen} brukerId={bruker.onPremisesSamAccountName} close={() => setIsOpen(false)} />
    </StyledContainer>
  );
};

interface DisplayEnhetProps {
  brukerId: string;
}

const DisplayEnhet: React.FC<DisplayEnhetProps> = ({ brukerId }) => {
  const { data } = useGetValgtEnhetQuery(brukerId);
  if (typeof data === 'undefined') {
    return <div>Laster...</div>;
  }
  return <div>{data?.navn}</div>;
};

interface DropdownProps {
  open: boolean;
  brukerId: string;
  close: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ open, brukerId }) => {
  const { data: valgtEnhet } = useGetValgtEnhetQuery(brukerId);
  const { data: enheter } = useGetEnheterQuery(brukerId ?? skipToken);
  const [setValgtEnhet] = useSetValgtEnhetMutation();
  if (!open || typeof enheter === 'undefined' || typeof valgtEnhet === 'undefined') {
    return null;
  }

  const onClick = (enhetId: string) => {
    setValgtEnhet({ enhetId, navIdent: brukerId });
    close();
  };

  return (
    <StyledDropdown>
      {enheter.map(({ id, navn }) => (
        <Enhet key={id}>
          <EnhetButton onClick={() => onClick(id)} disabled={id === valgtEnhet.id}>
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
  text-align: left;
`;

const StyledDropdown = styled.ul`
  position: absolute;
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  left: 0;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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
  text-align: left;
  color: black;
  padding: 0.5em;
  padding-left: 2em;

  &:hover {
    background-color: lightgrey;
  }

  :disabled {
    font-weight: bold;
    cursor: unset;
  }
`;
