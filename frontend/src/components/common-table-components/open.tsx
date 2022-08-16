import { Button } from '@navikt/ds-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAvailableEnheterForYtelse } from '../../hooks/use-available-enheter-for-ytelse';
import { OppgaveType } from '../../types/kodeverk';

interface Props {
  oppgavebehandlingId: string;
  ytelse: string;
  type: OppgaveType;
}

export const OpenOppgavebehandling = ({ oppgavebehandlingId, ytelse, type }: Props) => {
  const enheter = useAvailableEnheterForYtelse(ytelse);
  const hasAccess = enheter.length !== 0;

  if (!hasAccess) {
    return null;
  }

  if (type === OppgaveType.KLAGE) {
    return (
      <Button
        as={NavLink}
        variant="primary"
        size="medium"
        to={`/klagebehandling/${oppgavebehandlingId}`}
        data-testid="klagebehandling-open-link"
        data-klagebehandlingid={oppgavebehandlingId}
        data-oppgavebehandlingid={oppgavebehandlingId}
      >
        Åpne
      </Button>
    );
  }

  if (type === OppgaveType.ANKE) {
    return (
      <Button
        as={NavLink}
        variant="primary"
        size="medium"
        to={`/ankebehandling/${oppgavebehandlingId}`}
        data-testid="ankebehandling-open-link"
        data-ankebehandlingid={oppgavebehandlingId}
        data-oppgavebehandlingid={oppgavebehandlingId}
      >
        Åpne
      </Button>
    );
  }

  return (
    <Button
      as={NavLink}
      variant="primary"
      size="medium"
      to={`/trygderettsankebehandling/${oppgavebehandlingId}`}
      data-testid="trygderettsankebehandling-open-link"
      data-trygderettsankebehandlingid={oppgavebehandlingId}
      data-oppgavebehandlingid={oppgavebehandlingId}
    >
      Åpne
    </Button>
  );
};
