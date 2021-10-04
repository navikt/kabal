import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import {
  StyledFullfoerKlagebehandling,
  StyledFullfoerKlagebehandlingButtons,
  StyledFullfoerKlagebehandlingText,
  StyledSubHeader,
} from '../styled-components';

interface ConfirmProps {
  cancel: () => void;
}

const Confirm = ({ cancel }: ConfirmProps) => (
  // const confirm = () => {};

  <StyledFullfoerKlagebehandling>
    <StyledFullfoerKlagebehandlingText>
      Du fullfører nå klagebehandlingen, brevet sendes til søker og klagebehandlingen kan ikke redigeres. Bekreft at du
      faktisk ønsker å fullføre behandlingen.
    </StyledFullfoerKlagebehandlingText>
    <StyledFullfoerKlagebehandlingButtons>
      <Hovedknapp>Fullfør</Hovedknapp>
      <Knapp onClick={cancel}>Avbryt</Knapp>
    </StyledFullfoerKlagebehandlingButtons>
  </StyledFullfoerKlagebehandling>
);

export const FullfoerKlagebehandling = () => {
  const [showConfirmPopup, setShowConfirm] = useState(false);

  const cancel = () => {
    setShowConfirm(false);
  };

  const showConfirm = () => {
    setShowConfirm(true);
  };

  return (
    <div>
      <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>
      <Knapp mini onClick={showConfirm}>
        Fullfør klagebehandling
      </Knapp>
      {showConfirmPopup && <Confirm cancel={cancel} />}
    </div>
  );
};
