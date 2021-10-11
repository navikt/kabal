import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useIsMedunderskriver } from '../../../../hooks/use-is-medunderskriver';
import { useSwitchMedunderskriverflytMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling, MedunderskriverFlyt } from '../../../../redux-api/oppgave-state-types';

interface SendTilMedunderskriverProps {
  klagebehandling: IKlagebehandling;
}

export const SendTilSaksbehandler = ({ klagebehandling }: SendTilMedunderskriverProps) => {
  const { id: klagebehandlingId } = klagebehandling;
  const canEdit = useCanEdit(klagebehandlingId);
  const isMedunderskriver = useIsMedunderskriver(klagebehandlingId);

  const [switchMedunderskriverflyt, loader] = useSwitchMedunderskriverflytMutation();

  if (canEdit) {
    return null;
  }

  if (isMedunderskriver && klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <StyledFormSection>
        <AlertStripe type="info">Klagen er nå sendt tilbake til saksbehandler</AlertStripe>
      </StyledFormSection>
    );
  }

  if (isMedunderskriver && klagebehandling.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
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
`;
