import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Header = () => (
  <SCNav role="navigation" aria-label="Meny">
    <SCNavLinkList>
      <SCNavListItem>
        <SCNavLink to="/oppgaver">Oppgaver</SCNavLink>
      </SCNavListItem>
      <SCNavListItem>
        <SCNavLink to="/mineoppgaver">Mine Oppgaver</SCNavLink>
      </SCNavListItem>
      <SCNavListItem>
        <SCNavLink to="/sok">Søk på person</SCNavLink>
      </SCNavListItem>
    </SCNavLinkList>
  </SCNav>
);

const SCNav = styled.nav`
  background-color: #3e3832;
  diplay: flex;
`;

const SCNavLinkList = styled.ul`
  display: flex;
  list-style: none;
  padding: 5px 0 0 0;
  margin: 0 1em;
  border-bottom: 1px solid #3e3832;
`;

const SCNavListItem = styled.li`
  min-width: 10em;
  font-size: 1.2em;
  text-align: center;
`;

const SCNavLink = styled(NavLink)`
  width: 100%;
  display: block;
  text-decoration: none;
  color: white;
  border-bottom: 5px solid transparent;
  margin: 0;
  padding: 0.25em 0 0.25em 0;
  word-break: keep-all;
  white-space: nowrap;

  .active,
  :hover {
    text-decoration: none;
    color: #0067c5;
    border-bottom: 5px solid #0067c5;
  }
`;
