import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { VersionCheckerStatus } from '../version-checker/version-checker-status';
import { HomeIcon } from './home-icon';
import { User } from './user-menu/user';

export const Header = () => (
  <StyledHeader>
    <Nav>
      <StyledLogo to="/oppgaver/1">
        <HomeIcon />
        <StyledLabel>Kabal</StyledLabel>
      </StyledLogo>
      <Separator />
      <StyledNavLink to="/mineoppgaver">Mine oppgaver</StyledNavLink>
    </Nav>

    <VersionCheckerStatus />
    <User />
  </StyledHeader>
);

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding-left: 16px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  font-weight: 600;
  color: white;
`;

const StyledHeader = styled.header`
  z-index: 2;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  background: #3e3832;
`;

const StyledLogo = styled(NavLink)`
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.span`
  margin-left: 1em;
`;

const Separator = styled.div`
  display: flex;
  margin: 0 2em;
  border-left: 1px solid #c9c9c9;
  height: 100%;
`;
