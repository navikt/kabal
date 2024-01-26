import { useContext } from 'react';
import { UserContext } from '@app/components/app/user';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsMedunderskriver = () => {
  const user = useContext(UserContext);
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return false;
  }

  return (
    oppgave.medunderskriver.employee !== null &&
    oppgave.medunderskriver.flowState !== FlowState.NOT_SENT &&
    oppgave.medunderskriver.employee.navIdent === user.navIdent
  );
};
