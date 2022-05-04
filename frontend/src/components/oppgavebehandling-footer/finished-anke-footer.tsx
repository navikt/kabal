import { SuccessStroke } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import Alertstripe from 'nav-frontend-alertstriper';
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
        <Button variant="primary" type="button" size="small" disabled data-testid="complete-button">
          <SuccessStroke />
          <span>Fullfør</span>
        </Button>
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
