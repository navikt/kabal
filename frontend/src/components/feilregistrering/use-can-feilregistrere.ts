import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { Role } from '@/types/bruker';

export const useCanFeilregistrere = (tildeltSaksbehandlerident: string | null) => {
  const { user } = useContext(StaticDataContext);

  if (user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return true;
  }

  return tildeltSaksbehandlerident === null || user.navIdent === tildeltSaksbehandlerident;
};
