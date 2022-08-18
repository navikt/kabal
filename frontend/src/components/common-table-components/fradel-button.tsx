import { Alert, Button } from '@navikt/ds-react';
import React, { useCallback, useState } from 'react';
import { useIsLeader } from '../../hooks/use-has-role';
import { useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver/mutations/ansatte';
import { useUser } from '../../simple-api-state/use-user';

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
  const { data: userData, isLoading: isUserLoading } = useUser();
  const [done, setDone] = useState<boolean>(false);
  const isLeader = useIsLeader();

  const onFradel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }

    fradelSaksbehandler({
      oppgaveId: klagebehandlingId,
      navIdent: userData.navIdent,
    }).then(() => setDone(true));
  }, [klagebehandlingId, userData, fradelSaksbehandler]);

  if (isAvsluttetAvSaksbehandler) {
    return null;
  }

  if (!isLeader && tildeltSaksbehandlerident !== userData?.navIdent) {
    return null;
  }

  if (done) {
    return (
      <Alert data-testid="oppgave-fradel-success" data-oppgaveid={klagebehandlingId} variant="success" size="small">
        Lagt tilbake!
      </Alert>
    );
  }

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <Button
      variant="secondary"
      size="medium"
      type="button"
      onClick={onFradel}
      loading={isLoading}
      disabled={isLoading}
      data-testid="klagebehandling-fradel-button"
      data-klagebehandlingid={klagebehandlingId}
    >
      {getFradelText(loader.isLoading)}
    </Button>
  );
};

const getFradelText = (loading: boolean) => (loading ? 'Legger tilbake...' : 'Legg tilbake');
