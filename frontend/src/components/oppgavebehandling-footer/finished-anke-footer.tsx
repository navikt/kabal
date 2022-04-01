import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { OppgaveType, Utfall } from '../../types/kodeverk';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter } from './styled-components';

export const FinishedAnkeFooter = () => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined' || oppgave.type !== OppgaveType.ANKE) {
    return null;
  }

  return (
    <StyledFinishedFooter>
      <StyledButtons>
        <Hovedknapp mini disabled data-testid="complete-button">
          Fullfør
        </Hovedknapp>
        <BackLink />
      </StyledButtons>
      <Alertstripe type="suksess" form="inline">
        {getSuccessMessage(oppgave.resultat.utfall)}
      </Alertstripe>
    </StyledFinishedFooter>
  );
};

const getSuccessMessage = (utfall: Utfall | null) => {
  if (utfall === Utfall.OPPHEVET) {
    return 'Innstilling sendt til klager';
  }

  return 'Fullført behandling';
};
