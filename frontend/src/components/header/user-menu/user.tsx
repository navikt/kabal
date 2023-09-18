import { Dropdown, InternalHeader } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useUser } from '@app/simple-api-state/use-user';
import { UserDropdown } from './dropdown';

export const User = () => {
  const { data: bruker, isLoading } = useUser();

  const name = isLoading || bruker === undefined ? 'Laster...' : bruker.name;

  const enhet = isLoading || typeof bruker === 'undefined' ? 'Laster...' : bruker.ansattEnhet.navn;

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
