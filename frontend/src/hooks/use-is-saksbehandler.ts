import { StaticDataContext } from '@app/components/app/static-data-context';
import { useContext } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsSaksbehandler = () => {
  const { data, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return isSuccess && data.saksbehandler?.navIdent === user.navIdent;
};
