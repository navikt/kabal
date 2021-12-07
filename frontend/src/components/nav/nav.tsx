import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { useHasAnyOfRoles } from '../../hooks/use-has-role';
import { Role } from '../../redux-api/bruker';

const oppgaverPathRegex = /^\/oppgaver\/\d+/;

export const Nav = () => (
  <StyledNav role="navigation" aria-label="Meny" data-testid="oppgaver-nav">
    <StyledNavLinkList>
      <NavItem
        to="/oppgaver/1"
        isActive={(match, location) => oppgaverPathRegex.test(location.pathname)}
        testId="oppgaver-nav-link"
      >
        Oppgaver
      </NavItem>
      <NavItem to="/mineoppgaver" testId="mine-oppgaver-nav-link">
        Mine Oppgaver
      </NavItem>
      <NavItem to="/sok" testId="search-nav-link">
        Søk på person
      </NavItem>
      <NavItem
        to="/enhetensoppgaver"
        testId="enhetens-oppgaver-nav-link"
        roles={[Role.ROLE_KLAGE_LEDER, Role.ROLE_KLAGE_FAGANSVARLIG, Role.ROLE_KLAGE_MERKANTIL]}
      >
        Enhetens oppgaver
      </NavItem>
    </StyledNavLinkList>
  </StyledNav>
);

interface NavItemProps extends NavLinkProps {
  testId?: string;
  roles?: Role[];
}

const NavItem = ({ testId, roles, ...props }: NavItemProps) => {
  const hasRole = useHasAnyOfRoles(roles);

  if (!hasRole) {
    return null;
  }

  return (
    <StyledNavListItem>
      <StyledNavLink {...props} data-testid={testId} />
    </StyledNavListItem>
  );
};

const StyledNav = styled.nav`
  padding-top: 1em;
  padding-bottom: 1em;
`;

const StyledNavLinkList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  padding-top: 5px;
  margin: 0 1em;
  border-bottom: 1px solid #3e3832;
`;

const StyledNavListItem = styled.li`
  min-width: 10em;
  text-align: center;
  padding-right: 1em;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  width: 100%;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  color: #54483f;
  border-bottom: 5px solid transparent;
  margin: 0;
  padding: 0.25em 0 0.25em 0;
  word-break: keep-all;
  white-space: nowrap;
  min-width: 10em;

  &.active,
  &:hover {
    text-decoration: none;
    color: #0067c5;
    border-bottom: 5px solid #0067c5;
  }
`;
