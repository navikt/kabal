import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import { BackLink } from './back-link';
import { FooterType, StyledButtons, StyledFooter } from './styled-components';

export const FinishedFooter = () => (
  <StyledFooter $type={FooterType.FINISHED}>
    <StyledButtons>
      <Button
        variant="primary"
        type="button"
        size="small"
        disabled
        data-testid="complete-button"
        icon={<CheckmarkIcon aria-hidden />}
      >
        Fullfør
      </Button>
      <BackLink />
    </StyledButtons>
    <Alert variant="success" inline>
      Fullført
    </Alert>
  </StyledFooter>
);
