import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { FeatureToggles, useFeatureToggle } from '../../hooks/use-feature-toggle';
import { useHasAnyOfRoles } from '../../hooks/use-has-role';
import { Role } from '../../types/bruker';

export const Nav = () => (
  <StyledNav role="navigation" aria-label="Meny" data-testid="oppgaver-nav">
    <StyledNavLinkList>
      <NavItem to="/oppgaver/1" testId="oppgaver-nav-link">
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
        roles={[Role.ROLE_KLAGE_LEDER, Role.ROLE_KLAGE_FAGANSVARLIG, Role.ROLE_KLAGE_MERKANTIL, Role.ROLE_ADMIN]}
      >
        Enhetens oppgaver
      </NavItem>
      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/maltekster" testId="maltekster-nav-link">
        Maltekster
      </NavItem>
      <NavItem
        requiredFeature={FeatureToggles.MALTEKSTER}
        to="/redigerbare-maltekster"
        testId="redigerbare-maltekster-nav-link"
      >
        Redigerbare maltekster
      </NavItem>
      <NavItem
        requiredFeature={FeatureToggles.MALTEKSTER}
        to="/gode-formuleringer"
        testId="gode-formuleringer-nav-link"
      >
        Gode formuleringer
      </NavItem>
      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/regelverk" testId="regelverk-nav-link">
        Regelverk
      </NavItem>

      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/topptekster" testId="topptekster-nav-link">
        Topptekster
      </NavItem>

      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/bunntekster" testId="bunntekster-nav-link">
        Bunntekster
      </NavItem>
    </StyledNavLinkList>
  </StyledNav>
);

interface NavItemProps extends NavLinkProps {
  testId?: string;
  roles?: Role[];
  requiredFeature?: FeatureToggles;
}

const NavItem = ({ testId, roles, requiredFeature: feature, ...props }: NavItemProps) => {
  const hasRole = useHasAnyOfRoles(roles);
  const enabled = useFeatureToggle(feature);
  const featureDisabled = typeof feature !== 'undefined' && !enabled;

  if (!hasRole || featureDisabled) {
    return null;
  }

  return (
    <StyledNavListItem>
      <StyledNavLink {...props} data-testid={testId} />
    </StyledNavListItem>
  );
};

const StyledNav = styled.nav`
  padding-top: 16px;
  padding-bottom: 0;
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
