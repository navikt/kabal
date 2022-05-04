import { Close, Sandglass } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useDeleteSattPaaVentMutation, useSattPaaVentMutation } from '../../redux-api/oppgavebehandling';

export const VentButton = () => {
  const { data, isLoading: oppgaveIsloading } = useOppgave();
  const [settPaavent, { isLoading: sattPaaVentIsLoading }] = useSattPaaVentMutation();
  const [deleteSettPaavent, { isLoading: deleteSattPaaVentIsLoading }] = useDeleteSattPaaVentMutation();

  if (oppgaveIsloading || typeof data === 'undefined') {
    return null;
  }

  const isLoading = sattPaaVentIsLoading || deleteSattPaaVentIsLoading;

  if (typeof data.sattPaaVent === 'string') {
    return (
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => deleteSettPaavent(data.id)}
        loading={isLoading}
      >
        <Close /> Avslutt venteperiode
      </Button>
    );
  }

  return (
    <Button type="button" variant="secondary" size="small" onClick={() => settPaavent(data.id)} loading={isLoading}>
      <Sandglass /> Sett på vent
    </Button>
  );
};
