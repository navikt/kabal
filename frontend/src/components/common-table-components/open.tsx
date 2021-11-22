import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGetBrukerQuery } from '../../redux-api/bruker';

interface Props {
  klagebehandlingId: string;
  ytelse: string;
}

export const OpenKlagebehandling = ({ klagebehandlingId, ytelse }: Props) => {
  const { data: userData } = useGetBrukerQuery();
  const hasAccess = userData?.valgtEnhetView.lovligeYtelser.includes(ytelse) ?? false;

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
