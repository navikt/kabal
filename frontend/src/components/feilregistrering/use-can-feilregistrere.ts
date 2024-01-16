import { useContext } from 'react';
import { UserContext } from '@app/components/app/user';
import { Role } from '@app/types/bruker';

export const useCanFeilregistrere = (tildeltSaksbehandlerident: string | null) => {
  const user = useContext(UserContext);

  if (user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return true;
  }

  return tildeltSaksbehandlerident === null || user.navIdent === tildeltSaksbehandlerident;
};
