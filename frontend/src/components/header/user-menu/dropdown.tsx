import { DebugButton } from '@app/components/header/user-menu/debug';
import { useIsUpToDate } from '@app/components/version-checker/version-checker';
import { ENVIRONMENT } from '@app/environment';
import { pushEvent } from '@app/observability';
import { ArrowCirclepathIcon, BranchingIcon, CheckmarkCircleIcon, CogIcon, LeaveIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Dropdown, Tooltip } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';

export const UserDropdown = (): React.JSX.Element | null => {
  const { version } = ENVIRONMENT;
  const isUpToDate = useIsUpToDate();

  return (
    <Dropdown.Menu className="w-auto max-w-75 overflow-visible">
      <Dropdown.Menu.List>
        <Dropdown.Menu.List.Item
          as={NavLink}
          to="/innstillinger"
          data-testid="innstillinger-link"
          className={`${LINK_CLASSES} text-text-action`}
        >
          <CogIcon /> Innstillinger
        </Dropdown.Menu.List.Item>

        <Dropdown.Menu.List.Item
          as="a"
          href="/oauth2/logout"
          data-testid="logout-link"
          onClick={() => pushEvent('logout', 'user-menu')}
          className={`${LINK_CLASSES} text-text-danger`}
        >
          <LeaveIcon /> Logg ut
        </Dropdown.Menu.List.Item>

        <Dropdown.Menu.Divider />

        <Tooltip content={isUpToDate ? 'Du bruker siste versjon av Kabal' : 'Laster Kabal på nytt'} placement="left">
          <Dropdown.Menu.List.Item
            as={Button}
            icon={isUpToDate ? <CheckmarkCircleIcon aria-hidden /> : <ArrowCirclepathIcon aria-hidden />}
            size="small"
            className="justify-start"
            onClick={isUpToDate ? undefined : () => window.location.reload()}
          >
            {isUpToDate ? 'Kabal er oppdatert' : 'Oppdater Kabal'}
          </Dropdown.Menu.List.Item>
        </Tooltip>

        <Tooltip content="Kopierer versjonsnummeret til versjonen du bruker nå" placement="left">
          <Dropdown.Menu.List.Item
            as={CopyButton}
            title="Klikk for å kopiere versjonsnummeret"
            copyText={version}
            text={`Kabal-versjon: ${getShortVersion(version)}`}
            size="small"
            className="justify-start bg-bg-default hover:bg-surface-action-subtle-hover active:bg-surface-action-active"
            icon={<BranchingIcon aria-hidden />}
          >
            {null}
          </Dropdown.Menu.List.Item>
        </Tooltip>
        <DebugButton />
      </Dropdown.Menu.List>
    </Dropdown.Menu>
  );
};

const LINK_CLASSES =
  'flex gap-2 items-center cursor-pointer hover:bg-surface-action-subtle-hover active:bg-surface-action-active active:text-text-on-action';

const getShortVersion = (version: string): string => {
  if (version.length <= 7) {
    return version;
  }

  return `${version.substring(0, 7)}...`;
};
