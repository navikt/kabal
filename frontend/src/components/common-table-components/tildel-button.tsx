import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback } from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';

interface Props {
  klagebehandlingId: string;
}

export const TildelKlagebehandlingButton = ({ klagebehandlingId }: Props) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { data: userData, isLoading: isUserLoading } = useGetBrukerQuery();

  const onTildel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }

    tildelSaksbehandler({
      oppgaveId: klagebehandlingId,
      navIdent: userData.info.navIdent,
      enhetId: userData.valgtEnhetView.id,
    });
  }, [klagebehandlingId, userData, tildelSaksbehandler]);

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <Knapp onClick={onTildel} spinner={isLoading} disabled={isLoading}>
      {getTildelText(loader.isLoading)}
    </Knapp>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
