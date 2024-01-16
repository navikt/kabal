import { useContext } from 'react';
import { UserContext } from '@app/components/app/user';
import { Role } from '@app/types/bruker';

type LandingPagePath = [string, string] | null;

export const useLandingPagePath = (): LandingPagePath => {
  const user = useContext(UserContext);

  if (user.roller.some((r) => [Role.KABAL_INNSYN_EGEN_ENHET, Role.KABAL_KROL].includes(r))) {
    return ['/oppgavestyring', 'Oppgavestyring'];
  }

  if (user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return ['/sok', 'Søk'];
  }

  if (user.roller.some((r) => [Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL].includes(r))) {
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

  if (user.roller.includes(Role.KABAL_ADMIN)) {
    return ['/admin', 'Admin'];
  }

  return null;
};
