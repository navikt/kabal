import { Facilitet, FileContent, Law, LightBulb, List, Locked, Office1, Search, Task } from '@navikt/ds-icons';
import { Header } from '@navikt/ds-react-internal';
import { DocumentFooter } from '@styled-icons/fluentui-system-regular/DocumentFooter';
import { DocumentHeader } from '@styled-icons/fluentui-system-regular/DocumentHeader';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { FeatureToggles, useFeatureToggle } from '../../hooks/use-feature-toggle';
import { useHasAnyOfRoles } from '../../hooks/use-has-role';
import { Role } from '../../types/bruker';

export const Nav = () => (
  <Header.Title as={StyledNav} role="navigation" aria-label="Meny" data-testid="oppgaver-nav">
    <StyledNavLinkList>
      <NavItem to="/oppgaver/1" testId="oppgaver-nav-link">
        <List /> Oppgaver
      </NavItem>
      <NavItem to="/mineoppgaver" testId="mine-oppgaver-nav-link">
        <Task /> Mine Oppgaver
      </NavItem>
      <NavItem to="/sok" testId="search-nav-link">
        <Search /> Søk på person
      </NavItem>
      <NavItem
        to="/enhetensoppgaver"
        testId="enhetens-oppgaver-nav-link"
        roles={[Role.ROLE_KLAGE_LEDER, Role.ROLE_KLAGE_FAGANSVARLIG, Role.ROLE_KLAGE_MERKANTIL, Role.ROLE_ADMIN]}
      >
        <Office1 /> Enhetens oppgaver
      </NavItem>
      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/maltekster" testId="maltekster-nav-link">
        <Facilitet /> Maltekster
      </NavItem>
      <NavItem
        requiredFeature={FeatureToggles.MALTEKSTER}
        to="/redigerbare-maltekster"
        testId="redigerbare-maltekster-nav-link"
      >
        <FileContent /> Redigerbare maltekster
      </NavItem>
      <NavItem
        requiredFeature={FeatureToggles.MALTEKSTER}
        to="/gode-formuleringer"
        testId="gode-formuleringer-nav-link"
      >
        <LightBulb /> Gode formuleringer
      </NavItem>
      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/regelverk" testId="regelverk-nav-link">
        <Law /> Regelverk
      </NavItem>

      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/topptekster" testId="topptekster-nav-link">
        <DocumentHeader size={22} color="#fff" /> Topptekster
      </NavItem>

      <NavItem requiredFeature={FeatureToggles.MALTEKSTER} to="/bunntekster" testId="bunntekster-nav-link">
        <DocumentFooter size={22} color="#fff" /> Bunntekster
      </NavItem>

      <NavItem to="/tilgangsstyring" testId="access-rights-nav-link" roles={[Role.ROLE_KLAGE_LEDER]}>
        <Locked /> Tilgangsstyring
      </NavItem>
    </StyledNavLinkList>
  </Header.Title>
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
  height: 100%;
  flex-grow: 1;
  overflow-x: auto;
`;

const StyledNavLinkList = styled.ul`
  height: 100%;
  display: flex;
  list-style: none;
  padding: 0;
  align-items: center;
  margin: 0;
  gap: 16px;
`;

const StyledNavListItem = styled.li`
  text-align: center;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  border-bottom: 4px solid transparent;
  word-break: keep-all;
  white-space: nowrap;
  border-left: none;
  text-decoration: none;
  color: var(--navds-semantic-color-text-inverted);
  padding: 0;
  padding-left: 4px;
  padding-right: 4px;
  transition: border-bottom-color 0.2s ease-in-out;

  &.active {
    border-bottom: 4px solid var(--navds-global-color-blue-300);
  }

  &:hover {
    /* border-bottom: 4px solid var(--navds-semantic-color-link); */
    border-bottom: 4px solid #666;
  }
`;
