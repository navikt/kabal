import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling, MedunderskriverFlyt } from '../../../../redux-api/oppgave-state-types';
import { IMedunderskriverInfoResponse } from '../../../../redux-api/oppgave-types';

interface SendTilMedunderskriverProps {
  klagebehandling: IKlagebehandling;
  medunderskriverInfo: IMedunderskriverInfoResponse;
}

export const SendTilMedunderskriver = ({ klagebehandling, medunderskriverInfo }: SendTilMedunderskriverProps) => {
  const { id: klagebehandlingId, medunderskriver } = klagebehandling;
  const canEdit = useCanEdit(klagebehandlingId);

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
      <Hovedknapp
        mini
        onClick={() => switchMedunderskriverflyt({ klagebehandlingId })}
        disabled={sendToMedunderskriverDisabled}
        spinner={loader.isLoading}
        data-testid="send-to-medunderskriver"
      >
        Send til medunderskriver
      </Hovedknapp>
    </StyledFormSection>
  );

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <SentToMedunderskriver />;
  }

  if (medunderskriverInfo?.medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
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
`;
