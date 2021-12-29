import { useParams } from 'react-router-dom';

export const useOppgaveId = (): string => {
  const { id } = useParams();

  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(
      `"useOppgaveId" hook used outside of "/klagebehandling/:id" or "/ankebehandling/:id" routes. Current path "${window.location.pathname}".`
    );
  }

  return id;
};
