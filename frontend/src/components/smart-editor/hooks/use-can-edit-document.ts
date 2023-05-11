import { useMemo } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { MedunderskriverFlyt } from '@app/types/kodeverk';

export const useCanEditDocument = (): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading, isFetching: oppgaveIsFetching } = useOppgave();
  const { data: user, isLoading: userIsLoading } = useUser();

  return useMemo<boolean>(() => {
    if (oppgaveIsLoading || userIsLoading || oppgaveIsFetching) {
      return false;
    }

    if (typeof oppgave === 'undefined' || typeof user === 'undefined' || oppgave.isAvsluttetAvSaksbehandler) {
      return false;
    }

    if (oppgave.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
      return oppgave.medunderskriver?.navIdent === user.navIdent;
    }

    return oppgave.tildeltSaksbehandler?.navIdent === user.navIdent;
  }, [oppgave, oppgaveIsFetching, oppgaveIsLoading, user, userIsLoading]);
};