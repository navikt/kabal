import React from 'react';
import { NavLink } from 'react-router-dom';
import 'nav-frontend-knapper-style';
import { Utfall } from '../../../../redux-api/oppgave-state-types';
import { StyledAlertstripe, StyledPaddedContent, StyledSubHeader } from '../../styled-components';

interface KlagebehandlingFinishedProps {
  utfall: Utfall | null;
}

export const KlagebehandlingFinished = ({ utfall }: KlagebehandlingFinishedProps) => (
  <StyledPaddedContent>
    <StyledSubHeader>Fullfør klagebehandling</StyledSubHeader>{' '}
    <StyledAlertstripe type="suksess">{getSucessMessage(utfall)}</StyledAlertstripe>
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
