import { SuccessStroke } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter } from './styled-components';

export const FinishedFooter = () => (
  <StyledFinishedFooter>
    <StyledButtons>
      <Button
        variant="primary"
        type="button"
        size="small"
        disabled
        data-testid="complete-button"
        icon={<SuccessStroke aria-hidden />}
      >
        Fullfør
      </Button>
      <BackLink />
    </StyledButtons>
    <Alert variant="success" inline>
      Fullført
    </Alert>
  </StyledFinishedFooter>
);
