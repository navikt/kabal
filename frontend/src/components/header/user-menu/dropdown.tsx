import React from 'react';
import { LinkList, StyledDropdown, StyledLink, StyledNavLink } from './styled-components';

interface DropdownProps {
  open: boolean;
}

export const Dropdown = ({ open }: DropdownProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  return (
    <StyledDropdown>
      <LinkList>
        <li>
          <StyledNavLink to="/innstillinger">Innstillinger</StyledNavLink>
        </li>
        <li>
          <StyledLink href="/logout">Logg ut</StyledLink>
        </li>
      </LinkList>
    </StyledDropdown>
  );
};
