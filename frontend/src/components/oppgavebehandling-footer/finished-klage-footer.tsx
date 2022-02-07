import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter } from './styled-components';

export const FinishedKlageFooter = () => (
  <StyledFinishedFooter>
    <StyledButtons>
      <Hovedknapp mini disabled data-testid="complete-button">
        Fullfør
      </Hovedknapp>
      <BackLink />
    </StyledButtons>
    <Alertstripe type="suksess" form="inline">
      Fullført behandling
    </Alertstripe>
  </StyledFinishedFooter>
);
