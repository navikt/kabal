import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';

export const useCanFeilregistrere = (tildeltSaksbehandlerident: string | null) => {
  const { data: bruker, isLoading: brukerIsloading } = useUser();

  if (brukerIsloading || bruker === undefined) {
    return false;
  }

  if (bruker.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return true;
  }

  return tildeltSaksbehandlerident === null || bruker.navIdent === tildeltSaksbehandlerident;
};
