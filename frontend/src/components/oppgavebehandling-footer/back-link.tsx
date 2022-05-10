import { Back } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const BackLink = () => (
  <Button to="/mineoppgaver" as={NavLink} variant="secondary" size="small" data-testid="footer-button-back">
    <Back />
    <span>Mine oppgaver</span>
  </Button>
);
