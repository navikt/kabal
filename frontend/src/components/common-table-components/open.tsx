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
      <NavLink
        className="knapp knapp--hoved"
        to={`/klagebehandling/${oppgavebehandlingId}`}
        data-testid="klagebehandling-open-link"
        data-klagebehandlingid={oppgavebehandlingId}
        data-oppgavebehandlingid={oppgavebehandlingId}
      >
        Åpne
      </NavLink>
    );
  }

  return (
    <NavLink
      className="knapp knapp--hoved"
      to={`/ankebehandling/${oppgavebehandlingId}`}
      data-testid="ankebehandling-open-link"
      data-ankebehandlingid={oppgavebehandlingId}
      data-oppgavebehandlingid={oppgavebehandlingId}
    >
      Åpne
    </NavLink>
  );
};
