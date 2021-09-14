import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Nav: React.FC = () => (
  <SCNav role="navigation" aria-label="Meny">
    <SCNavLinkList>
      <SCNavListItem>
        <SCNavLink to="/oppgaver/1">Oppgaver</SCNavLink>
      </SCNavListItem>
      <SCNavListItem>
        <SCNavLink to="/mineoppgaver">Mine Oppgaver</SCNavLink>
      </SCNavListItem>
      <SCNavListItem>
        <SCNavLink to="/sok">Søk på person</SCNavLink>
      </SCNavListItem>
      <SCNavListItem>
        <SCNavLink to="/enhetensoppgaver">Enhetens oppgaver</SCNavLink>
      </SCNavListItem>
    </SCNavLinkList>
  </SCNav>
);

const SCNav = styled.nav`
  padding-top: 1em;
  padding-bottom: 1em;
`;

const SCNavLinkList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  padding-top: 5px;
  margin: 0 1em;
  border-bottom: 1px solid #3e3832;
`;

const SCNavListItem = styled.li`
  min-width: 10em;
  text-align: center;
  padding-right: 1em;
`;

const SCNavLink = styled(NavLink)`
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
