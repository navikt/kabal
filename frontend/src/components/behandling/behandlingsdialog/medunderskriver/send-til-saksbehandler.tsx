import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useCheckIsMedunderskriver } from '../../../../hooks/use-is-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling, MedunderskriverFlyt } from '../../../../redux-api/oppgave-state-types';
import { IMedunderskriverInfoResponse } from '../../../../redux-api/oppgave-types';

interface SendTilMedunderskriverProps {
  klagebehandling: IKlagebehandling;
  medunderskriverInfo: IMedunderskriverInfoResponse;
}

export const SendTilSaksbehandler = ({ klagebehandling }: SendTilMedunderskriverProps) => {
  const { id: klagebehandlingId } = klagebehandling;
  const canEdit = useCanEdit(klagebehandlingId);
  const isMedunderskriver = useCheckIsMedunderskriver(klagebehandlingId);

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (canEdit || !isMedunderskriver) {
    return null;
  }

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <StyledFormSection>
        <AlertStripe type="info">Klagen er nå sendt tilbake til saksbehandler</AlertStripe>
      </StyledFormSection>
    );
  }

  if (klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return (
      <StyledFormSection>
        <Hovedknapp
          mini
          onClick={() => switchMedunderskriverflyt({ klagebehandlingId })}
          disabled={loader.isLoading}
          spinner={loader.isLoading}
          autoDisableVedSpinner
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
