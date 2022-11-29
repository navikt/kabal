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
      <NavItem to="/oppgaver/1" testId="oppgaver-nav-link" roles={[Role.KABAL_SAKSBEHANDLING]}>
        <List /> Oppgaver
      </NavItem>
      <NavItem to="/mineoppgaver" testId="mine-oppgaver-nav-link" roles={[Role.KABAL_SAKSBEHANDLING]}>
        <Task /> Mine Oppgaver
      </NavItem>
      <NavItem
        to="/sok"
        testId="search-nav-link"
        roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]}
      >
        <Search /> Søk på person
      </NavItem>
      <NavItem to="/enhetensoppgaver" testId="enhetens-oppgaver-nav-link" roles={[Role.KABAL_INNSYN_EGEN_ENHET]}>
        <Office1 /> Enhetens oppgaver
      </NavItem>

      <NavItem to="/maltekster" testId="maltekster-nav-link" roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <Facilitet /> Maltekster
      </NavItem>

      <NavItem
        to="/redigerbare-maltekster"
        testId="redigerbare-maltekster-nav-link"
        roles={[Role.KABAL_MALTEKSTREDIGERING]}
      >
        <FileContent /> Redigerbare maltekster
      </NavItem>

      <NavItem to="/gode-formuleringer" testId="gode-formuleringer-nav-link" roles={[Role.KABAL_FAGTEKSTREDIGERING]}>
        <LightBulb /> Gode formuleringer
      </NavItem>

      <NavItem to="/regelverk" testId="regelverk-nav-link" roles={[Role.KABAL_FAGTEKSTREDIGERING]}>
        <Law /> Regelverk
      </NavItem>

      <NavItem to="/topptekster" testId="topptekster-nav-link" roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <DocumentHeader size={22} color="#fff" /> Topptekster
      </NavItem>

      <NavItem to="/bunntekster" testId="bunntekster-nav-link" roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <DocumentFooter size={22} color="#fff" /> Bunntekster
      </NavItem>

      <NavItem to="/tilgangsstyring" testId="access-rights-nav-link" roles={[Role.KABAL_TILGANGSSTYRING_EGEN_ENHET]}>
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
  color: var(--a-text-on-inverted);
  padding: 0;
  padding-left: 4px;
  padding-right: 4px;
  transition: border-bottom-color 0.2s ease-in-out;

  &.active {
    border-bottom: 4px solid var(--a-blue-300);
  }

  &:hover {
    /* border-bottom: 4px solid var(--a-text-action); */
    border-bottom: 4px solid #666;
  }
`;
