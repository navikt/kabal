import {
  Buildings3Icon,
  BulletListIcon,
  EnvelopeClosedIcon,
  FileIcon,
  FileTextIcon,
  GavelIcon,
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
import { DEFAULT_STATUS_FILTER } from '@/components/smart-editor-texts/status-filter/status-filter';
import { useHasAnyOfRoles } from '@/hooks/use-has-role';
import { Role } from '@/types/bruker';

export const Nav = () => (
  <HStack as="nav" flexGrow="1" overflowX="auto" aria-label="Meny">
    <HStack as="ol" align="center" gap="space-16" wrap={false} height="100%" paddingInline="space-16">
      <NavItem to="/oppgaver" roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL]}>
        <BulletListIcon aria-hidden /> Oppgaver
      </NavItem>

      <NavItem to="/mineoppgaver" roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL]}>
        <TasklistIcon aria-hidden /> Mine Oppgaver
      </NavItem>

      <NavItem to="/sok" roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER, Role.KABAL_ROL]}>
        <MagnifyingGlassIcon aria-hidden /> Søk på person
      </NavItem>

      <NavItem to="/oppgavestyring" roles={[Role.KABAL_INNSYN_EGEN_ENHET, Role.KABAL_KROL]}>
        <Buildings3Icon aria-hidden /> Oppgavestyring
      </NavItem>

      <NavItem to="/saker-i-tr" roles={[Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]}>
        <GavelIcon aria-hidden /> Saker i Trygderetten
      </NavItem>

      <NavItem to={`/maltekstseksjoner?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <PuzzlePieceIcon aria-hidden /> Maltekstseksjoner
      </NavItem>

      <NavItem to={`/maltekster?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <FileIcon aria-hidden /> Maltekster
      </NavItem>

      <NavItem to={`/redigerbare-maltekster?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <FileTextIcon aria-hidden /> Redigerbare maltekster
      </NavItem>

      <NavItem to={`/gode-formuleringer?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_FAGTEKSTREDIGERING]}>
        <LightBulbIcon aria-hidden /> Gode formuleringer
      </NavItem>

      <NavItem to={`/regelverk?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_FAGTEKSTREDIGERING]}>
        <GavelSoundBlockIcon aria-hidden /> Regelverk
      </NavItem>

      <NavItem to={`/topptekster?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <DocumentHeader size={22} color="#fff" /> Topptekster
      </NavItem>

      <NavItem to={`/bunntekster?${DEFAULT_STATUS_FILTER}`} roles={[Role.KABAL_MALTEKSTREDIGERING]}>
        <DocumentFooter size={22} color="#fff" /> Bunntekster
      </NavItem>

      <NavItem to="/svarbrev" roles={[Role.KABAL_SVARBREVINNSTILLINGER]}>
        <EnvelopeClosedIcon aria-hidden /> Svarbrev
      </NavItem>

      <NavItem to="/tilgangsstyring" roles={[Role.KABAL_TILGANGSSTYRING_EGEN_ENHET]}>
        <PadlockLockedIcon aria-hidden /> Tilgangsstyring
      </NavItem>
    </HStack>
  </HStack>
);

interface NavItemProps extends NavLinkProps {
  roles?: Role[];
}

const NavItem = ({ roles, children, ...props }: NavItemProps) => {
  const hasRole = useHasAnyOfRoles(roles);

  if (!hasRole) {
    return null;
  }

  return (
    <HStack as="li" align="center">
      <NavLink
        {...props}
        className={({ isActive }) =>
          `flex w-full items-center gap-2 whitespace-nowrap border-transparent border-b-2 px-1 transition-colors hover:border-ax-border-neutral-strong ${isActive ? 'border-b-ax-border-focus' : ''}`
        }
      >
        {children}
      </NavLink>
    </HStack>
  );
};
