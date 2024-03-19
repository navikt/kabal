import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

export const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );

  if (oppgave === undefined || oppgave.medunderskriver.employee === null || medunderskriverSignature === undefined) {
    return null;
  }

  return medunderskriverSignature;
};

export const useSaksbehandlerSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: saksbehandlerSignature } = useGetSignatureQuery(
    typeof oppgave?.saksbehandler?.navIdent === 'string' ? oppgave.saksbehandler.navIdent : skipToken,
  );

  if (oppgave === undefined || oppgave.saksbehandler === null || saksbehandlerSignature === undefined) {
    return null;
  }

  return saksbehandlerSignature;
};
