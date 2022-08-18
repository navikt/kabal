import { SuccessStroke } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
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
        <Button
          variant="primary"
          type="button"
          size="small"
          disabled
          data-testid="complete-button"
          icon={<SuccessStroke aria-hidden />}
        >
          Fullfør
        </Button>
        <BackLink />
      </StyledButtons>
      <Alert variant="success" inline>
        {getSuccessMessage(oppgave.resultat.utfall)}
      </Alert>
    </StyledFinishedFooter>
  );
};

const getSuccessMessage = (utfall: Utfall | null) => {
  if (utfall === Utfall.OPPHEVET) {
    return 'Innstilling sendt til klager';
  }

  return 'Fullført behandling';
};
