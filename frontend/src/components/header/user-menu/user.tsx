import { Dropdown, Header } from '@navikt/ds-react-internal';
import React from 'react';
import styled from 'styled-components';
import { useGetBrukerQuery, useGetMySignatureQuery } from '../../../redux-api/bruker';
import { UserDropdown } from './dropdown';

export const User = () => {
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();

  const name =
    signatureIsLoading || typeof signature === 'undefined'
      ? 'Laster...'
      : signature.customLongName ?? signature.longName;

  const enhet = brukerIsLoading || typeof bruker === 'undefined' ? 'Laster...' : bruker.ansattEnhet.navn;

  return (
    <Dropdown>
      <Header.UserButton as={StyledToggle} data-testid="user-menu-button" name={name} description={`Enhet: ${enhet}`} />
      <UserDropdown />
    </Dropdown>
  );
};

const StyledToggle = styled(Dropdown.Toggle)`
  white-space: nowrap;
`;
