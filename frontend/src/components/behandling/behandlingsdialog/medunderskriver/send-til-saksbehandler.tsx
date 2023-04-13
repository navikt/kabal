import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '@app/redux-api/oppgaver/mutations/switch-medunderskriverflyt';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const SendTilSaksbehandler = ({
  id: oppgaveId,
  medunderskriverFlyt,
}: Pick<IOppgavebehandling, 'id' | 'medunderskriverFlyt'>) => {
  const canEdit = useCanEdit();
  const isMedunderskriver = useIsMedunderskriver();

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (canEdit || !isMedunderskriver) {
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
