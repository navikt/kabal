import Alertstripe from 'nav-frontend-alertstriper';
import 'nav-frontend-knapper-style';
import React from 'react';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { Utfall } from '../../redux-api/oppgave-state-types';

export const KlagebehandlingFinished = () => {
  const [klagebehandling] = useKlagebehandling();

  if (typeof klagebehandling === 'undefined') {
    return null;
  }

  return (
    <Alertstripe type="suksess" form="inline">
      {getSuccessMessage(klagebehandling.resultat.utfall)}
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
