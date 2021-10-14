import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGetBrukerQuery } from '../../redux-api/bruker';

interface Props {
  klagebehandlingId: string;
  tema: string;
}

export const OpenKlagebehandling = ({ klagebehandlingId, tema }: Props) => {
  const { data: userData } = useGetBrukerQuery();
  const hasAccess = userData?.valgtEnhetView.lovligeTemaer.includes(tema) ?? false;

  if (!hasAccess) {
    return null;
  }

  return (
    <NavLink className="knapp knapp--hoved" to={`/klagebehandling/${klagebehandlingId}`}>
      Åpne
    </NavLink>
  );
};
