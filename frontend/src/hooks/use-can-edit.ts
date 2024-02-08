import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useCanEdit = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (oppgavebehandlingIsLoading || typeof oppgavebehandling === 'undefined') {
      return false;
    }

    return (
      !oppgavebehandling.isAvsluttetAvSaksbehandler &&
      oppgavebehandling.saksbehandler !== null &&
      oppgavebehandling.saksbehandler.navIdent === user.navIdent &&
      oppgavebehandling.feilregistrering === null
    );
  }, [oppgavebehandling, oppgavebehandlingIsLoading, user.navIdent]);
};
