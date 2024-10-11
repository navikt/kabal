import { StaticDataContext } from '@app/components/app/static-data-context';
import { Role } from '@app/types/bruker';
import { useContext } from 'react';

export const useCanFeilregistrere = (tildeltSaksbehandlerident: string | null) => {
  const { user } = useContext(StaticDataContext);

  if (user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return true;
  }

  return tildeltSaksbehandlerident === null || user.navIdent === tildeltSaksbehandlerident;
};
