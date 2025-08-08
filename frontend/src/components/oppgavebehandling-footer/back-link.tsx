import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';

export const BackLink = () => (
  <Button
    to="/mineoppgaver"
    as={NavLink}
    variant="secondary-neutral"
    size="small"
    data-testid="footer-button-back"
    icon={<ChevronLeftIcon aria-hidden />}
  >
    Mine oppgaver
  </Button>
);
