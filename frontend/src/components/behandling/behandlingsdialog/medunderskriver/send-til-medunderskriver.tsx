import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../../../domain/date';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling, MedunderskriverFlyt } from '../../../../redux-api/oppgave-state-types';
import { IMedunderskriver } from '../../../../redux-api/oppgave-types';

interface SendTilMedunderskriverProps {
  klagebehandling: IKlagebehandling;
  medunderskrivere: IMedunderskriver[];
}

export const SendTilMedunderskriver = ({ klagebehandling, medunderskrivere }: SendTilMedunderskriverProps) => {
  const { id: klagebehandlingId, medunderskriverident } = klagebehandling;
  const canEdit = useCanEdit(klagebehandlingId);

  const valgtMedunderskriverNavn = useMemo(() => {
    const found = medunderskrivere.find((medunderskriver) => medunderskriver.ident === medunderskriverident);

    if (found) {
      return found.navn;
    }

    return medunderskriverident;
  }, [medunderskrivere, medunderskriverident]);

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  const sendToMedunderskriverDisabled = !canEdit || klagebehandling.medunderskriverident === null;

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return (
      <StyledFormSection>
        <StyledAlertstripe type="info">
          <p>Sendt til medunderskriver: {valgtMedunderskriverNavn}</p>
          <p>{isoDateToPretty(klagebehandling.datoSendtMedunderskriver)}</p>
        </StyledAlertstripe>
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

const StyledAlertstripe = styled(AlertStripe)`
  p {
    margin: 0;
  }
`;
