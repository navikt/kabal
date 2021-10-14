import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback } from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver';

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

  const onFradel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }

    fradelSaksbehandler({
      oppgaveId: klagebehandlingId,
      navIdent: userData.info.navIdent,
    });
  }, [klagebehandlingId, userData, fradelSaksbehandler]);

  if (isAvsluttetAvSaksbehandler) {
    return null;
  }

  if (tildeltSaksbehandlerident !== userData?.info.navIdent) {
    return null;
  }

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <Knapp onClick={onFradel} spinner={isLoading} disabled={isLoading}>
      {getFradelText(loader.isLoading)}
    </Knapp>
  );
};

const getFradelText = (loading: boolean) => (loading ? 'Legger tilbake...' : 'Legg tilbake');
