import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import 'nav-frontend-knapper-style';
import React from 'react';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useKlagerName } from '../../../../hooks/use-klager-name';
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
  const klagebehandlingId = useKlagebehandlingId();
  const [finishKlagebehandling] = useFinishKlagebehandlingMutation();
  const klagerName = useKlagerName();

  const finish = () => {
    finishKlagebehandling({ klagebehandlingId });
  };

  return (
    <StyledFinishKlagebehandlingBox>
      <StyledFinishKlagebehandlingText>
        Du fullfører nå klagebehandlingen, brevet sendes til {klagerName ?? 'søker'} og klagebehandlingen kan ikke
        redigeres. Bekreft at du faktisk ønsker å fullføre behandlingen.
      </StyledFinishKlagebehandlingText>
      <StyledFinishKlagebehandlingButtons>
        <Hovedknapp mini onClick={finish}>
          Fullfør
        </Hovedknapp>
        <Knapp mini onClick={cancel}>
          Avbryt
        </Knapp>
      </StyledFinishKlagebehandlingButtons>
    </StyledFinishKlagebehandlingBox>
  );
};
