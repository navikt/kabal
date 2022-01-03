import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useCheckIsMedunderskriver } from '../../../../hooks/use-is-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgavebehandling';
import { MedunderskriverFlyt } from '../../../../types/kodeverk';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling';

export const SendTilSaksbehandler = ({
  id: oppgaveId,
  type,
  medunderskriverFlyt,
}: Pick<IOppgavebehandling, 'id' | 'type' | 'medunderskriverFlyt'>) => {
  const canEdit = useCanEdit();
  const isMedunderskriver = useCheckIsMedunderskriver();

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
        <Hovedknapp
          mini
          onClick={() => switchMedunderskriverflyt({ oppgaveId, type })}
          disabled={loader.isLoading}
          spinner={loader.isLoading}
          autoDisableVedSpinner
          data-testid="send-to-saksbehandler"
        >
          Send til saksbehandler
        </Hovedknapp>
      </StyledFormSection>
    );
  }

  return null;
};

const StyledFormSection = styled.div`
  margin-top: 20px;
  white-space: normal;
`;
