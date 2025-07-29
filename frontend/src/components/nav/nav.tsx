import { DEFAULT_STATUS_FILTER } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import {
  Buildings3Icon,
  BulletListIcon,
  EnvelopeClosedIcon,
  FileIcon,
  FileTextIcon,
  GavelSoundBlockIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  PadlockLockedIcon,
  PuzzlePieceIcon,
  TasklistIcon,
} from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';
import { DocumentFooter } from '@styled-icons/fluentui-system-regular/DocumentFooter';
import { DocumentHeader } from '@styled-icons/fluentui-system-regular/DocumentHeader';
import { NavLink, type NavLinkProps } from 'react-router-dom';

export const Nav = () => (
  <HStack as="nav" flexGrow="1" overflowX="auto" aria-label="Meny" data-testid="oppgaver-nav">
    <HStack as="ol" align="center" gap="4" wrap={false} height="100%" paddingInline="4">
      <NavItem to="/oppgaver" testId="oppgaver-nav-link" roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL]}>
        <BulletListIcon /> Oppgaver
      </NavItem>

      <NavItem to="/mineoppgaver" testId="mine-oppgaver-nav-link" roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL]}>
        <TasklistIcon /> Mine Oppgaver
      </NavItem>

      <NavItem
        to="/sok"
        testId="search-nav-link"
        roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER, Role.KABAL_ROL, Role.KABAL_ROL]}
      >
        <MagnifyingGlassIcon /> Søk på person
      </NavItem>

      <NavItem
        to="/oppgavestyring"
        testId="oppgavestyring-nav-link"
        roles={[Role.KABAL_INNSYN_EGEN_ENHET, Role.KABAL_KROL]}
      >
        <Buildings3Icon /> Oppgavestyring
      </NavItem>

      <NavItem
        to={`/maltekstseksjoner?${DEFAULT_STATUS_FILTER}`}
        testId="maltekstseksjoner-nav-link"
        roles={[Role.KABAL_MALTEKSTREDIGERING]}
      >
        <PuzzlePieceIcon /> Maltekstseksjoner
      </NavItem>

      <NavItem
        to={`/maltekster?${DEFAULT_STATUS_FILTER}`}
        testId="maltekster-nav-link"
        roles={[Role.KABAL_MALTEKSTREDIGERING]}
      >
        <FileIcon /> Maltekster
      </NavItem>

      <NavItem
        to={`/redigerbare-maltekster?${DEFAULT_STATUS_FILTER}`}
        testId="redigerbare-maltekster-nav-link"
        roles={[Role.KABAL_MALTEKSTREDIGERING]}
      >
        <FileTextIcon /> Redigerbare maltekster
      </NavItem>

      <NavItem
        to={`/gode-formuleringer?${DEFAULT_STATUS_FILTER}`}
        testId="gode-formuleringer-nav-link"
        roles={[Role.KABAL_FAGTEKSTREDIGERING]}
      >
        <LightBulbIcon /> Gode formuleringer
      </NavItem>

      <NavItem
        to={`/regelverk?${DEFAULT_STATUS_FILTER}`}
        testId="regelverk-nav-link"
        roles={[Role.KABAL_FAGTEKSTREDIGERING]}
      >
        <GavelSoundBlockIcon /> Regelverk
      </NavItem>

      <NavItem
        to={`/topptekster?${DEFAULT_STATUS_FILTER}`}
        testId="topptekster-nav-link"
        roles={[Role.KABAL_MALTEKSTREDIGERING]}
      >
        <DocumentHeader size={22} color="#fff" /> Topptekster
      </NavItem>

      <NavItem
        to={`/bunntekster?${DEFAULT_STATUS_FILTER}`}
        testId="bunntekster-nav-link"
        roles={[Role.KABAL_MALTEKSTREDIGERING]}
      >
        <DocumentFooter size={22} color="#fff" /> Bunntekster
      </NavItem>

      <NavItem to="/svarbrev" testId="svarbrev-nav-link" roles={[Role.KABAL_SVARBREVINNSTILLINGER]}>
        <EnvelopeClosedIcon /> Svarbrev
      </NavItem>

      <NavItem to="/tilgangsstyring" testId="access-rights-nav-link" roles={[Role.KABAL_TILGANGSSTYRING_EGEN_ENHET]}>
        <PadlockLockedIcon /> Tilgangsstyring
      </NavItem>
    </HStack>
  </HStack>
);

interface NavItemProps extends NavLinkProps {
  testId?: string;
  roles?: Role[];
}

const NavItem = ({ testId, roles, children, ...props }: NavItemProps) => {
  const hasRole = useHasAnyOfRoles(roles);

  if (!hasRole) {
    return null;
  }

  return (
    <HStack as="li" align="center">
      <NavLink
        {...props}
        data-testid={testId}
        className={({ isActive }) =>
          `flex w-full items-center gap-2 whitespace-nowrap border-transparent border-b-2 px-1 transition-colors hover:border-ax-border-neutral-strong ${isActive ? 'border-b-ax-border-focus' : ''}`
        }
      >
        {children}
      </NavLink>
    </HStack>
  );
};
