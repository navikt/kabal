import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { User } from './user';

export const Header = () => (
  <StyledHeader>
    <StyledLogo to={'/oppgaver/1'}>KABAL</StyledLogo>
    <User />
  </StyledHeader>
);

const StyledHeader = styled.header`
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 3em;
  padding: 0 1.5rem;
  background: #3e3832;
  align-items: center;
`;

const StyledLogo = styled(NavLink)`
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
`;
