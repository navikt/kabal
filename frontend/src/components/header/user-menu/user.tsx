import { Dropdown, InternalHeader } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { useUser } from '@app/simple-api-state/use-user';
import { UserDropdown } from './dropdown';

export const User = () => {
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();

  const name =
    signatureIsLoading || typeof signature === 'undefined'
      ? 'Laster...'
      : signature.customLongName ?? signature.longName;

  const enhet = brukerIsLoading || typeof bruker === 'undefined' ? 'Laster...' : bruker.ansattEnhet.navn;

  return (
    <Dropdown>
      <InternalHeader.UserButton
        as={StyledToggle}
        data-testid="user-menu-button"
        name={name}
        description={`Enhet: ${enhet}`}
      />
      <UserDropdown />
    </Dropdown>
  );
};

const StyledToggle = styled(Dropdown.Toggle)`
  white-space: nowrap;
`;
