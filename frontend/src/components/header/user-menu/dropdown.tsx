import { AutomaticSystem, Logout, Settings } from '@navikt/ds-icons';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { CopyButton } from '../../copy-button/copy-button';

interface DropdownProps {
  open: boolean;
}

export const Dropdown = ({ open }: DropdownProps): JSX.Element | null => {
  if (!open) {
    return null;
  }

  const version = process.env.VERSION ?? 'UKJENT';

  return (
    <StyledList>
      <StyledLi>
        <StyledNavLink to="/innstillinger" data-testid="innstillinger-link">
          <Settings /> Innstillinger
        </StyledNavLink>
      </StyledLi>
      <StyledLi>
        <StyledLink href="/logout">
          <Logout /> Logg ut
        </StyledLink>
      </StyledLi>
      <StyledLi>
        <CopyButton title="Klikk for å kopiere versjonsnummeret" text={version}>
          <AutomaticSystem />
          KABAL-versjon: <VersionNumber>{version}</VersionNumber>
        </CopyButton>
      </StyledLi>
    </StyledList>
  );
};

const iconText = css`
  & {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const VersionNumber = styled.code`
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const linkStyle = css`
  ${iconText}
  & {
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

const StyledLink = styled.a`
  ${linkStyle}
`;

export const StyledNavLink = styled(NavLink)`
  ${linkStyle}
`;

const StyledList = styled.ul`
  position: absolute;
  right: 0;
  top: 100%;
  list-style: none;
  background-color: #3e3832;
  color: #fff;
  padding: 0;
  margin: 0;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

const StyledLi = styled.li`
  padding: 0;
  border-top: 1px solid #fff;
  white-space: nowrap;

  :hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
