import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../../../domain/date';
import { IKlagebehandling, MedunderskriverFlyt } from '../../../../redux-api/oppgave-state-types';

interface SendTilMedunderskriverProps {
  klagebehandling: IKlagebehandling;
  onSendToMedunderskriver: () => void;
}

export const SendTilMedunderskriver = ({ klagebehandling, onSendToMedunderskriver }: SendTilMedunderskriverProps) => {
  const sendToMedunderskriverDisabled = klagebehandling.medunderskriverident === null;

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return (
      <StyledAlertstripe type="info">
        <p>Sendt til medunderskriver: {klagebehandling.medunderskriverident}</p>
        <p>{isoDateToPretty(klagebehandling.datoSendtMedunderskriver)}</p>
      </StyledAlertstripe>
    );
  }

  return (
    <SendToMedunderskriverButton
      onSendToMedunderskriver={onSendToMedunderskriver}
      disabled={sendToMedunderskriverDisabled}
    />
  );
};

interface ActionButtonProps {
  onSendToMedunderskriver: () => void;
  disabled: boolean;
}

const SendToMedunderskriverButton = ({ onSendToMedunderskriver, disabled }: ActionButtonProps) => (
  <StyledFormSection>
    <Hovedknapp mini onClick={() => onSendToMedunderskriver()} disabled={disabled}>
      Send til medunderskriver
    </Hovedknapp>
  </StyledFormSection>
);

const StyledFormSection = styled.div`
  margin-top: 20px;
`;

const StyledAlertstripe = styled(AlertStripe)`
  p {
    margin: 0;
  }
`;
