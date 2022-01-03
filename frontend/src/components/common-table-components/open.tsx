import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAvailableEnheterForYtelse } from '../../hooks/use-available-enheter-for-ytelse';

interface Props {
  klagebehandlingId: string;
  ytelse: string;
}

export const OpenKlagebehandling = ({ klagebehandlingId, ytelse }: Props) => {
  const enheter = useAvailableEnheterForYtelse(ytelse);
  const hasAccess = enheter.length !== 0;

  if (!hasAccess) {
    return null;
  }

  return (
    <NavLink
      className="knapp knapp--hoved"
      to={`/klagebehandling/${klagebehandlingId}`}
      data-testid="klagebehandling-open-link"
      data-klagebehandlingid={klagebehandlingId}
    >
      Åpne
    </NavLink>
  );
};
