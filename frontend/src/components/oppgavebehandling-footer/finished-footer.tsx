import { SuccessStroke } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { OppgaveType, Utfall } from '../../types/kodeverk';
import { IOppgavebehandling } from '../../types/oppgavebehandling/oppgavebehandling';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter } from './styled-components';

export const FinishedFooter = () => {
  const { data: oppgave } = useOppgave();

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
        {getSuccessMessage(oppgave)}
      </Alert>
    </StyledFinishedFooter>
  );
};

const getSuccessMessage = (oppgave?: IOppgavebehandling) => {
  if (oppgave?.type === OppgaveType.ANKE && oppgave.resultat.utfall === Utfall.OPPHEVET) {
    return 'Innstilling sendt til klager';
  }

  return 'Fullført behandling';
};
