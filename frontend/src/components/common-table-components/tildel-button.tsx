import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useState } from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { SuccessStatus } from './styled-components';

interface Props {
  klagebehandlingId: string;
  tema: string;
}

export const TildelKlagebehandlingButton = ({ klagebehandlingId, tema }: Props) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { data: userData, isLoading: isUserLoading } = useGetBrukerQuery();
  const [done, setDone] = useState<boolean>(false);

  const onTildel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }

    tildelSaksbehandler({
      oppgaveId: klagebehandlingId,
      navIdent: userData.info.navIdent,
    }).then(() => setDone(true));
  }, [klagebehandlingId, userData, tildelSaksbehandler, setDone]);

  const hasAccess = userData?.valgtEnhetView.lovligeTemaer.includes(tema) ?? false;

  if (!hasAccess) {
    return null;
  }

  if (done) {
    return <SuccessStatus>Tildelt!</SuccessStatus>;
  }

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <Knapp
      onClick={onTildel}
      spinner={isLoading}
      disabled={isLoading}
      data-testid="klagebehandling-tildel-button"
      data-klagebehandlingid={klagebehandlingId}
    >
      {getTildelText(loader.isLoading)}
    </Knapp>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
