import { useParams } from 'react-router-dom';

interface IKlagebehandlingParams {
  id?: string;
}

export const useKlagebehandlingId = (): string => {
  const { id } = useParams<IKlagebehandlingParams>();

  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(
      `"useKlagebehandlingId" hook used outside of "/klagebehandling/:id" route. Current path "${window.location.pathname}".`
    );
  }

  return id;
};
