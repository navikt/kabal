import { Send } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useIsMedunderskriver } from '../../../../hooks/use-is-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgavebehandling';
import { MedunderskriverFlyt } from '../../../../types/kodeverk';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling';

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
        <AlertStripe type="info">Klagen er nå sendt tilbake til saksbehandler</AlertStripe>
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
        >
          <Send />
          <span>Send til saksbehandler</span>
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
