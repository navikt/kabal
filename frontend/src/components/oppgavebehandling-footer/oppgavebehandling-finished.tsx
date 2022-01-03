import Alertstripe from 'nav-frontend-alertstriper';
import 'nav-frontend-knapper-style';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { Utfall } from '../../types/kodeverk';

export const OppgavebehandlingFinished = () => {
  const { data: oppgavebehandling } = useOppgave();

  if (typeof oppgavebehandling === 'undefined') {
    return null;
  }

  return (
    <Alertstripe type="suksess" form="inline">
      {getSuccessMessage(oppgavebehandling.resultat.utfall)}
    </Alertstripe>
  );
};

const getSuccessMessage = (utfall: Utfall | null) => {
  switch (utfall) {
    case Utfall.RETUR:
      return 'Klagen er returnert';
    case Utfall.TRUKKET:
      return 'Klagen er trukket';
    default:
      return 'Fullført behandling';
  }
};
