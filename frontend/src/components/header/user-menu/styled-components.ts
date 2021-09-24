import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const StyledContainer = styled.div`
  position: relative;
`;

export const StyledButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0.5em;
  color: white;
  text-align: left;
`;

export const StyledDropdown = styled.div`
  position: absolute;
  text-align: left;
  left: 0;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
`;

export const EnhetList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const LinkList = styled.ul`
  margin-top: 10px;
  border-top: 1px solid #dcd9d9;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Enhet = styled.li`
  display: block;
  width: 100%;
`;

const itemCSS = css`
  display: block;
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0.5em;
  text-align: left;
  color: black;
  padding: 0.5em;
  padding-left: 2em;
  text-decoration: none;

  &:hover {
    background-color: lightgrey;
  }

  :disabled {
    font-weight: bold;
    cursor: unset;
  }
`;

export const StyledEnhetButton = styled.button`
  ${itemCSS}
`;

export const StyledNavLink = styled(NavLink)`
  ${itemCSS}
`;

export const StyledLink = styled(Link)`
  ${itemCSS}
`;
