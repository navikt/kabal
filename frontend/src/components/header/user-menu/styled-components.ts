import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const StyledContainer = styled.div`
  position: relative;
  height: 100%;
  color: #fff;
`;

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
  color: white;
`;

export const StyledDropdown = styled.div`
  position: absolute;
  text-align: left;
  right: 0;
  top: 100%;
  min-width: 100%;
  background-color: #3e3832;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

export const EnhetList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const LinkList = styled.ul`
  margin-top: 10px;
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
  padding: 0.5em;
  padding-left: 2em;
  text-decoration: none;
  color: inherit;
  border-top: 1px solid #fff;

  :hover {
    background-color: rgba(255, 255, 255, 0.2);
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

export const StyledLink = styled.a`
  ${itemCSS}
`;
