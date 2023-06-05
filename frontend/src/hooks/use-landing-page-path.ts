import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';

type LandingPagePath = [false, string, string] | [true] | [false, null];

export const useLandingPagePath = (): LandingPagePath => {
  const { data, isLoading } = useUser();

  if (isLoading || typeof data === 'undefined') {
    return [true];
  }

  if (data.roller.includes(Role.KABAL_INNSYN_EGEN_ENHET)) {
    return [false, '/enhetensoppgaver', 'Enhetens oppgaver'];
  }

  if (data.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return [false, '/sok', 'Søk'];
  }

  if (data.roller.includes(Role.KABAL_SAKSBEHANDLING)) {
    return [false, '/mineoppgaver', 'Mine oppgaver'];
  }

  if (data.roller.includes(Role.KABAL_TILGANGSSTYRING_EGEN_ENHET)) {
    return [false, '/tilgangsstyring', 'Tilgangsstyring'];
  }

  if (data.roller.includes(Role.KABAL_FAGTEKSTREDIGERING)) {
    return [false, '/gode-formuleringer', 'Gode formuleringer'];
  }

  if (data.roller.includes(Role.KABAL_MALTEKSTREDIGERING)) {
    return [false, '/maltekster', 'Maltekster'];
  }

  if (data.roller.includes(Role.KABAL_ADMIN)) {
    return [false, '/admin', 'Admin'];
  }

  return [false, null];
};