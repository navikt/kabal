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
  StyledFinishKlagebehandlingBox,
  StyledFinishKlagebehandlingButtons,
  StyledFinishKlagebehandlingText,
  StyledPaddedContent,
  StyledSubHeader,
} from '../styled-components';

interface FinishProps {
  cancel: () => void;
}

const ConfirmFinish = ({ cancel }: FinishProps) => (
  <StyledFinishKlagebehandlingBox>
    <StyledFinishKlagebehandlingText>
      Du fullfører nå klagebehandlingen, brevet sendes til søker og klagebehandlingen kan ikke redigeres. Bekreft at du
      faktisk ønsker å fullføre behandlingen.
    </StyledFinishKlagebehandlingText>
    <StyledFinishKlagebehandlingButtons>
      <Hovedknapp>Fullfør</Hovedknapp>
      <Knapp onClick={cancel}>Avbryt</Knapp>
    </StyledFinishKlagebehandlingButtons>
  </StyledFinishKlagebehandlingBox>
);

export const FinishKlagebehandling = () => {
  const id = useKlagebehandlingId();
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);
  const [showConfirmFinish, setConfirmFinish] = useState(false);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const cancel = () => {
    setConfirmFinish(false);
  };

  const showFinish = () => {
    setConfirmFinish(true);
  };

  if (klagebehandling.avsluttetAvSaksbehandler !== null) {
    return <KlagebehandlingFinished utfall={klagebehandling.vedtaket.utfall} />;
  }

  return (
    <>
      <StyledPaddedContent>
        <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>
        {!showConfirmFinish && (
          <Knapp mini onClick={showFinish}>
            Fullfør klagebehandling
          </Knapp>
        )}
      </StyledPaddedContent>
      {showConfirmFinish && <ConfirmFinish cancel={cancel} />}
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
