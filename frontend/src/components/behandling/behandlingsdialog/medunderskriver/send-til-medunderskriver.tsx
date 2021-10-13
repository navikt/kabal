import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling, MedunderskriverFlyt } from '../../../../redux-api/oppgave-state-types';

interface SendTilMedunderskriverProps {
  klagebehandling: IKlagebehandling;
}

export const SendTilMedunderskriver = ({ klagebehandling }: SendTilMedunderskriverProps) => {
  const { id: klagebehandlingId, medunderskriver } = klagebehandling;
  const canEdit = useCanEdit(klagebehandlingId);

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (!canEdit) {
    return null;
  }

  const sendToMedunderskriverDisabled = !canEdit || medunderskriver === null;

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return (
      <StyledFormSection>
        <AlertStripe type="info">Sendt til medunderskriver</AlertStripe>
      </StyledFormSection>
    );
  }

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <StyledFormSection>
        <AlertStripe type="info">Sendt tilbake av medunderskriver</AlertStripe>
      </StyledFormSection>
    );
  }

  return (
    <StyledFormSection>
      <Hovedknapp
        mini
        onClick={() => switchMedunderskriverflyt({ klagebehandlingId })}
        disabled={sendToMedunderskriverDisabled}
        spinner={loader.isLoading}
      >
        Send til medunderskriver
      </Hovedknapp>
    </StyledFormSection>
  );
};

const StyledFormSection = styled.div`
  margin-top: 20px;
`;
