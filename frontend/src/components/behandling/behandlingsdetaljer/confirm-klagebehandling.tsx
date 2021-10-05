import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'nav-frontend-knapper-style';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../../redux-api/oppgave';
import { Utfall } from '../../../redux-api/oppgave-state-types';
import {
  StyledAlertstripe,
  StyledConfirmKlagebehandlingBox,
  StyledConfirmKlagebehandlingButtons,
  StyledConfirmKlagebehandlingText,
  StyledPaddedContent,
  StyledSubHeader,
} from '../styled-components';

interface ConfirmProps {
  cancel: () => void;
}

const Confirm = ({ cancel }: ConfirmProps) => (
  <StyledConfirmKlagebehandlingBox>
    <StyledConfirmKlagebehandlingText>
      Du fullfører nå klagebehandlingen, brevet sendes til søker og klagebehandlingen kan ikke redigeres. Bekreft at du
      faktisk ønsker å fullføre behandlingen.
    </StyledConfirmKlagebehandlingText>
    <StyledConfirmKlagebehandlingButtons>
      <Hovedknapp>Fullfør</Hovedknapp>
      <Knapp onClick={cancel}>Avbryt</Knapp>
    </StyledConfirmKlagebehandlingButtons>
  </StyledConfirmKlagebehandlingBox>
);

export const ConfirmKlagebehandling = () => {
  const id = useKlagebehandlingId();
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);
  const [showConfirmPopup, setShowConfirm] = useState(false);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const cancel = () => {
    setShowConfirm(false);
  };

  const showConfirm = () => {
    setShowConfirm(true);
  };

  if (klagebehandling.avsluttetAvSaksbehandler !== null) {
    return <KlagebehandlingFinished utfall={klagebehandling.vedtaket.utfall} />;
  }

  return (
    <>
      <StyledPaddedContent>
        <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>
        {!showConfirmPopup && (
          <Knapp mini onClick={showConfirm}>
            Fullfør klagebehandling
          </Knapp>
        )}
      </StyledPaddedContent>
      {showConfirmPopup && <Confirm cancel={cancel} />}
    </>
  );
};

interface KlagebehandlingFinishedProps {
  utfall: Utfall | null;
}

const KlagebehandlingFinished = ({ utfall }: KlagebehandlingFinishedProps) => (
  <StyledPaddedContent>
    <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>{' '}
    <StyledAlertstripe>
      <Alertstripe type="suksess">{getSucessMessage(utfall)}</Alertstripe>
    </StyledAlertstripe>
    <NavLink className="knapp knapp--mini" to="/oppgaver/1">
      Tilbake til oppgaver
    </NavLink>
  </StyledPaddedContent>
);

const getSucessMessage = (utfall: Utfall | null) => {
  switch (utfall) {
    case Utfall.RETUR:
      return 'Klagen er returnert';
    case Utfall.TRUKKET:
      return 'Klagen er trukket';
    default:
      return 'Fullført behandling';
  }
};
