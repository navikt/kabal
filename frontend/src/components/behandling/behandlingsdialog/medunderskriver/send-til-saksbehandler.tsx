import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '@app/redux-api/oppgaver/mutations/switch-medunderskriverflyt';
import { useUser } from '@app/simple-api-state/use-user';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const SendTilSaksbehandler = ({
  id: oppgaveId,
  medunderskriverFlyt,
}: Pick<IOppgavebehandling, 'id' | 'medunderskriverFlyt'>) => {
  const isMedunderskriver = useIsMedunderskriver();
  const { data: oppgavebehandling, isLoading: oppgavebehandlingIsLoading } = useOppgave();
  const { data: userData, isLoading: userIsLoading } = useUser();

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (
    oppgavebehandlingIsLoading ||
    userIsLoading ||
    typeof oppgavebehandling === 'undefined' ||
    typeof userData === 'undefined'
  ) {
    return null;
  }

  if (
    oppgavebehandling.isAvsluttetAvSaksbehandler ||
    oppgavebehandling.tildeltSaksbehandlerident === userData.navIdent ||
    oppgavebehandling.feilregistrering !== null ||
    !isMedunderskriver
  ) {
    return null;
  }

  if (medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <StyledFormSection>
        <Alert variant="info" size="small">
          Klagen er nå sendt tilbake til saksbehandler
        </Alert>
      </StyledFormSection>
    );
  }

  if (medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return (
      <StyledFormSection>
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => switchMedunderskriverflyt({ oppgaveId, isSaksbehandler: false })}
          disabled={loader.isLoading}
          loading={loader.isLoading}
          data-testid="send-to-saksbehandler"
          icon={<PaperplaneIcon aria-hidden />}
        >
          Send til saksbehandler
        </Button>
      </StyledFormSection>
    );
  }

  return null;
};

const StyledFormSection = styled.div`
  margin-top: 20px;
  white-space: normal;
`;
