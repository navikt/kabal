import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgavebehandling';
import { MedunderskriverFlyt } from '../../../../types/kodeverk';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling';

type SendTilMedunderskriverProps = Pick<IOppgavebehandling, 'id' | 'medunderskriver' | 'medunderskriverFlyt'>;

export const SendTilMedunderskriver = ({
  id: oppgaveId,
  medunderskriver,
  medunderskriverFlyt,
}: SendTilMedunderskriverProps) => {
  const canEdit = useCanEdit();

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (!canEdit) {
    return null;
  }

  const sendToMedunderskriverDisabled = !canEdit || medunderskriver === null || loader.isLoading;

  const SentToMedunderskriver = () => (
    <StyledFormSection>
      <AlertStripe type="info">Sendt til medunderskriver</AlertStripe>
    </StyledFormSection>
  );

  const SentBackToMedunderskriver = () => (
    <StyledFormSection>
      <AlertStripe type="info">Sendt tilbake av medunderskriver</AlertStripe>
    </StyledFormSection>
  );

  const SendToMedunderskriver = () => (
    <StyledFormSection>
      <StyledHovedknapp
        mini
        onClick={() => switchMedunderskriverflyt(oppgaveId)}
        disabled={sendToMedunderskriverDisabled}
        spinner={loader.isLoading}
        data-testid="send-to-medunderskriver"
      >
        Send til medunderskriver
      </StyledHovedknapp>
    </StyledFormSection>
  );

  if (medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <SentToMedunderskriver />;
  }

  if (medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <>
        <SentBackToMedunderskriver />
        <SendToMedunderskriver />
      </>
    );
  }

  return <SendToMedunderskriver />;
};

const StyledFormSection = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const StyledHovedknapp = styled(Hovedknapp)`
  width: 100%;
`;
