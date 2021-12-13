import { useParams } from 'react-router-dom';

export const useKlagebehandlingId = (): string => {
  const { id } = useParams();

  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(
      `"useKlagebehandlingId" hook used outside of "/klagebehandling/:id" route. Current path "${window.location.pathname}".`
    );
  }

  return id;
};
