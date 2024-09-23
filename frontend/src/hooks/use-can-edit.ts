import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useCanEdit = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (
      oppgavebehandlingIsLoading ||
      oppgavebehandling === undefined ||
      oppgavebehandling.isAvsluttetAvSaksbehandler ||
      oppgavebehandling.feilregistrering !== null ||
      oppgavebehandling.saksbehandler === null
    ) {
      return false;
    }

    return oppgavebehandling.saksbehandler.navIdent === user.navIdent;
  }, [oppgavebehandling, oppgavebehandlingIsLoading, user.navIdent]);
};

export const useCanEditBehandling = () => {
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();

  const canEdit = useCanEdit();

  return useMemo(() => {
    if (
      oppgavebehandlingIsLoading ||
      oppgavebehandling === undefined ||
      oppgavebehandling.medunderskriver.flowState === FlowState.SENT
    ) {
      return false;
    }

    return canEdit;
  }, [canEdit, oppgavebehandling, oppgavebehandlingIsLoading]);
};
