import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import 'nav-frontend-knapper-style';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import { useFinishKlagebehandlingMutation } from '../../../../redux-api/oppgave';
import {
  StyledFinishKlagebehandlingBox,
  StyledFinishKlagebehandlingButtons,
  StyledFinishKlagebehandlingText,
} from '../../styled-components';

interface FinishProps {
  cancel: () => void;
}

export const ConfirmFinish = ({ cancel }: FinishProps) => {
  const { data: bruker, isLoading } = useGetBrukerQuery();
  const klagebehandlingId = useKlagebehandlingId();
  const [finishKlagebehandling] = useFinishKlagebehandlingMutation();

  if (typeof bruker === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const finish = () => {
    finishKlagebehandling({
      klagebehandlingId,
      journalfoerendeEnhet: bruker.valgtEnhetView.id,
    });
  };

  return (
    <StyledFinishKlagebehandlingBox>
      <StyledFinishKlagebehandlingText>
        Du fullfører nå klagebehandlingen, brevet sendes til søker og klagebehandlingen kan ikke redigeres. Bekreft at
        du faktisk ønsker å fullføre behandlingen.
      </StyledFinishKlagebehandlingText>
      <StyledFinishKlagebehandlingButtons>
        <Hovedknapp onClick={finish}>Fullfør</Hovedknapp>
        <Knapp onClick={cancel}>Avbryt</Knapp>
      </StyledFinishKlagebehandlingButtons>
    </StyledFinishKlagebehandlingBox>
  );
};
