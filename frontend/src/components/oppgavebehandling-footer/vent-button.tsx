import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useDeleteSattPaaVentMutation, useSattPaaVentMutation } from '../../redux-api/oppgavebehandling';
import { OppgaveType } from '../../types/kodeverk';

export const VentButton = () => {
  const { data, isLoading: oppgaveIsloading } = useOppgave();
  const [settPaavent, { isLoading: sattPaaVentIsLoading }] = useSattPaaVentMutation();
  const [deleteSettPaavent, { isLoading: deleteSattPaaVentIsLoading }] = useDeleteSattPaaVentMutation();

  if (oppgaveIsloading || typeof data === 'undefined' || data.type !== OppgaveType.ANKEBEHANDLING) {
    return null;
  }

  if (typeof data.sattPaaVent === 'string') {
    return (
      <Knapp
        mini
        kompakt
        onClick={() => deleteSettPaavent(data.id)}
        autoDisableVedSpinner
        spinner={sattPaaVentIsLoading || deleteSattPaaVentIsLoading}
      >
        Avslutt venteperiode
      </Knapp>
    );
  }

  return (
    <Knapp
      mini
      kompakt
      onClick={() => settPaavent(data.id)}
      autoDisableVedSpinner
      spinner={sattPaaVentIsLoading || deleteSattPaaVentIsLoading}
    >
      Sett på vent
    </Knapp>
  );
};
