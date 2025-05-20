import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import { useContext } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

/** Checks if the current user is assigned to the current case as saksbehandler. */
export const useLazyIsTildeltSaksbehandler = () => {
  const { data, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return () => isSuccess && data.saksbehandler?.navIdent === user.navIdent;
};

/** Checks if the current user is assigned to the current case as saksbehandler. */
export const useIsTildeltSaksbehandler = () => {
  const isLazyTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();

  return isLazyTildeltSaksbehandler();
};

/** Checks if the current user has the saksbehandler role. */
export const useIsSaksbehandler = (): boolean => useHasRole(Role.KABAL_SAKSBEHANDLING);
