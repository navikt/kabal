import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback, useState } from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { SuccessStatus } from './styled-components';

interface Props {
  klagebehandlingId: string;
  tildeltSaksbehandlerident: string | null;
  isAvsluttetAvSaksbehandler: boolean;
}

export const FradelKlagebehandlingButton = ({
  klagebehandlingId,
  tildeltSaksbehandlerident,
  isAvsluttetAvSaksbehandler,
}: Props): JSX.Element | null => {
  const [fradelSaksbehandler, loader] = useFradelSaksbehandlerMutation();
  const { data: userData, isLoading: isUserLoading } = useGetBrukerQuery();
  const [done, setDone] = useState<boolean>(false);

  const onFradel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }

    fradelSaksbehandler({
      oppgaveId: klagebehandlingId,
      navIdent: userData.info.navIdent,
    }).then(() => setDone(true));
  }, [klagebehandlingId, userData, fradelSaksbehandler]);

  if (isAvsluttetAvSaksbehandler) {
    return null;
  }

  if (tildeltSaksbehandlerident !== userData?.info.navIdent) {
    return null;
  }

  if (done) {
    return <SuccessStatus>Lagt tilbake!</SuccessStatus>;
  }

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <Knapp
      onClick={onFradel}
      spinner={isLoading}
      disabled={isLoading}
      data-testid="klagebehandling-fradel-button"
      data-klagebehandlingid={klagebehandlingId}
    >
      {getFradelText(loader.isLoading)}
    </Knapp>
  );
};

const getFradelText = (loading: boolean) => (loading ? 'Legger tilbake...' : 'Legg tilbake');
