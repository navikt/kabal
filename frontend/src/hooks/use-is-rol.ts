import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import { useContext, useMemo } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsRol = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const isRolWithAnyFlowState = useIsRolWithAnyFlowState();

  return useMemo(() => {
    if (!isSuccess) {
      return false;
    }

    return isRolWithAnyFlowState && oppgave.rol.flowState !== FlowState.NOT_SENT;
  }, [oppgave, isSuccess, isRolWithAnyFlowState]);
};

export const useIsRolWithAnyFlowState = () => {
  const { data: oppgave, isSuccess } = useOppgave();

  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (!isSuccess) {
      return false;
    }

    return oppgave.rol.employee !== null && oppgave.rol.employee.navIdent === user.navIdent;
  }, [oppgave, isSuccess, user]);
};
