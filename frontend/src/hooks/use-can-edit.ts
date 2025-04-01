import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import { useContext, useMemo } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useNoOneCanEdit = () => {
  const { data, isSuccess } = useOppgave();

  return useMemo(
    () => !isSuccess || data.isAvsluttetAvSaksbehandler || data.feilregistrering !== null,
    [data, isSuccess],
  );
};

export const useCanEdit = () => {
  const { data: oppgavebehandling, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const noOneCanEdit = useNoOneCanEdit();

  return useMemo(() => {
    if (noOneCanEdit || !isSuccess || oppgavebehandling.saksbehandler === null) {
      return false;
    }

    return oppgavebehandling.saksbehandler.navIdent === user.navIdent;
  }, [oppgavebehandling, isSuccess, user.navIdent, noOneCanEdit]);
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
