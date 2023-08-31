import { useMemo } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';

export const useCanChangeMedunderskriver = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();

  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  return useMemo(() => {
    if (oppgavebehandlingIsLoading || typeof oppgavebehandling === 'undefined') {
      return false;
    }

    return isSaksbehandler || hasOppgavestyringRole;
  }, [oppgavebehandlingIsLoading, oppgavebehandling, isSaksbehandler, hasOppgavestyringRole]);
};
