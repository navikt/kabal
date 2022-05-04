import { SuccessStroke } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter } from './styled-components';

export const FinishedKlageFooter = () => (
  <StyledFinishedFooter>
    <StyledButtons>
      <Button type="button" size="small" variant="primary" disabled data-testid="complete-button">
        <SuccessStroke />
        <span>Fullfør</span>
      </Button>
      <BackLink />
    </StyledButtons>
    <Alertstripe type="suksess" form="inline">
      Fullført behandling
    </Alertstripe>
  </StyledFinishedFooter>
);
