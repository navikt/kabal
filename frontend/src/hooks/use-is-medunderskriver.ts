import { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsMedunderskriver = () => {
  const { user } = useContext(StaticDataContext);
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
