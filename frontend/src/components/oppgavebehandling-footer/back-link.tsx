import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const BackLink = () => (
  <Button
    to="/mineoppgaver"
    as={NavLink}
    variant="secondary"
    size="small"
    data-testid="footer-button-back"
    icon={<ChevronLeftIcon aria-hidden />}
  >
    Mine oppgaver
  </Button>
);
