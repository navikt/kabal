import { Dropdown, InternalHeader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { UserContext } from '@app/components/app/user';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { UserDropdown } from './dropdown';

export const User = () => {
  const { data: signature, isLoading: signatureIsLoading } = useGetMySignatureQuery();
  const user = useContext(UserContext);

  const name =
    signatureIsLoading || typeof signature === 'undefined'
      ? 'Laster...'
      : signature.customLongName ?? signature.longName;

  return (
    <Dropdown>
      <InternalHeader.UserButton
        as={StyledToggle}
        data-testid="user-menu-button"
        name={name}
        description={`Enhet: ${user.ansattEnhet.navn}`}
      />
      <UserDropdown />
    </Dropdown>
  );
};

const StyledToggle = styled(Dropdown.Toggle)`
  white-space: nowrap;
`;
