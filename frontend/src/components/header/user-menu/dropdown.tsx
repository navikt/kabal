import { CogIcon, CogRotationIcon, LeaveIcon } from '@navikt/aksel-icons';
import { Dropdown } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';
import { css, styled } from 'styled-components';
import { ENVIRONMENT } from '@app/environment';
import { pushEvent } from '@app/observability';
import { CopyButton } from '../../copy-button/copy-button';

export const UserDropdown = (): JSX.Element | null => {
  const { version } = ENVIRONMENT;

  return (
    <Menu>
      <Dropdown.Menu.List>
        <Dropdown.Menu.List.Item as={StyledNavLink} to="/innstillinger" data-testid="innstillinger-link">
          <CogIcon /> Innstillinger
        </Dropdown.Menu.List.Item>
        <Dropdown.Menu.List.Item
          as={StyledLogoutLink}
          href="/oauth2/logout"
          data-testid="logout-link"
          onClick={() => pushEvent('logout', 'user-menu')}
        >
          <LeaveIcon /> Logg ut
        </Dropdown.Menu.List.Item>
        <Dropdown.Menu.Divider />
        <Dropdown.Menu.List.Item
          as={StyledCopyButton}
          title="Klikk for å kopiere versjonsnummeret"
          copyText={version}
          text={`Kabal-versjon: ${getShortVersion(version)}`}
          icon={<VersionIcon fontSize={16} aria-hidden />}
        >
          {null}
        </Dropdown.Menu.List.Item>
      </Dropdown.Menu.List>
    </Menu>
  );
};

const Menu = styled(Dropdown.Menu)`
  overflow: visible;
  width: auto;
  max-width: 300px;

  & .navds-body-short {
    font-size: var(--a-spacing-4);
  }
`;

const linkStyle = css`
  display: flex;
  gap: var(--a-spacing-2);
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  padding-top: var(--a-spacing-3);
  padding-bottom: var(--a-spacing-3);
`;

const StyledLink = styled.a`
  ${linkStyle}
`;

const StyledLogoutLink = styled(StyledLink)`
  color: #c30000;
`;

const StyledNavLink = styled(NavLink)`
  ${linkStyle}
`;

const StyledCopyButton = styled(CopyButton)`
  ${linkStyle}
  white-space: nowrap;
  justify-content: flex-start;
  overflow: hidden;

  &:hover {
    color: var(--a-text-action-on-action-subtle);
  }

  svg {
    margin: 0;
  }

  .navds-copybutton__icon {
    margin: 0;
  }

  .navds-copybutton__content {
    justify-content: flex-start;
  }
`;

const VersionIcon = styled(CogRotationIcon)`
  margin-right: var(--a-spacing-2);
`;

const getShortVersion = (version: string): string => {
  if (version.length <= 7) {
    return version;
  }

  return version.substring(0, 7) + '...';
};
