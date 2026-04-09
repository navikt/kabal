import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { NavLink } from 'react-router-dom';

export const BackLink = () => (
  <Button
    data-color="neutral"
    to="/mineoppgaver"
    as={NavLink}
    variant="secondary"
    size="small"
    icon={<ChevronLeftIcon aria-hidden />}
  >
    Mine oppgaver
  </Button>
);
