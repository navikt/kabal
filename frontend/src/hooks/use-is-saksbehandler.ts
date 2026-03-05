import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import { useContext } from 'react';

/** Checks if the current user is assigned to the current case as saksbehandler. */
export const useLazyIsTildeltSaksbehandler = () => {
  const { data, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return () =>
    isSuccess &&
    !data.isAvsluttetAvSaksbehandler && // Ferdigstilte saker har ikke tildelt saksbehandler. Dette er kun historisk informasjon.
    data.feilregistrering === null && // Feilregistrerte saker har ikke tildelt saksbehandler. Dette er kun historisk informasjon.
    data.saksbehandler?.navIdent === user.navIdent;
};

/** Checks if the current user is assigned to the current case as saksbehandler. */
export const useIsTildeltSaksbehandler = () => {
  const isLazyTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();

  return isLazyTildeltSaksbehandler();
};

/** Checks if the current user has the saksbehandler role. */
export const useIsSaksbehandler = (): boolean => useHasRole(Role.KABAL_SAKSBEHANDLING);

export const getIsSaksbehandler = (roles: Role[]): boolean => roles.includes(Role.KABAL_SAKSBEHANDLING);
