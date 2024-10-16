import { StaticDataContext } from '@app/components/app/static-data-context';
import { Role } from '@app/types/bruker';
import { useContext } from 'react';

type LandingPagePath = [string, string] | null;

const OPPGAVESTYRING_ROLES = [Role.KABAL_INNSYN_EGEN_ENHET, Role.KABAL_KROL];
const MINE_OPPGAVER_ROLES = [Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL];

export const useLandingPagePath = (): LandingPagePath => {
  const { user } = useContext(StaticDataContext);

  if (user.roller.some((r) => OPPGAVESTYRING_ROLES.includes(r))) {
    return ['/oppgavestyring', 'Oppgavestyring'];
  }

  if (user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return ['/sok', 'Søk'];
  }

  if (user.roller.some((r) => MINE_OPPGAVER_ROLES.includes(r))) {
    return ['/mineoppgaver', 'Mine oppgaver'];
  }

  if (user.roller.includes(Role.KABAL_TILGANGSSTYRING_EGEN_ENHET)) {
    return ['/tilgangsstyring', 'Tilgangsstyring'];
  }

  if (user.roller.includes(Role.KABAL_FAGTEKSTREDIGERING)) {
    return ['/gode-formuleringer', 'Gode formuleringer'];
  }

  if (user.roller.includes(Role.KABAL_MALTEKSTREDIGERING)) {
    return ['/maltekstseksjoner', 'Maltekstseksjoner'];
  }

  return null;
};
