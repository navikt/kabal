import { useMatch } from 'react-router-dom';
import { OppgaveType } from '../types/kodeverk';

export const useOppgaveType = (): OppgaveType => {
  const klageMatch = useMatch('/klagebehandling/:id');
  const ankeMatch = useMatch('/ankebehandling/:id');

  if (klageMatch !== null) {
    return OppgaveType.KLAGEBEHANDLING;
  }

  if (ankeMatch !== null) {
    return OppgaveType.ANKEBEHANDLING;
  }

  throw new Error(
    `"useOppgaveType" hook used outside of "/klagebehandling/:id" or "/ankebehandling/:id" routes. Current path "${window.location.pathname}".`
  );
};
