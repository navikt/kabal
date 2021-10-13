import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { isoDateToPretty } from '../../domain/date';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';

export const Row = ({
  id,
  type,
  tema,
  utfall,
  hjemmel,
  avsluttetAvSaksbehandlerDate,
  person,
}: IKlagebehandling): JSX.Element => {
  const { data: kodeverk } = useGetKodeverkQuery();

  const utfallName = useMemo(() => {
    if (typeof kodeverk === 'undefined') {
      return '';
    }

    return kodeverk.utfall.find((u) => u.id === utfall)?.navn;
  }, [kodeverk, utfall]);

  return (
    <tr>
      <td>
        <LabelMain>{useTypeFromId(type)}</LabelMain>
      </td>
      <td>
        <LabelTema tema={tema}>{useTemaFromId(tema)}</LabelTema>
      </td>
      <td>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
      </td>
      <td>{person?.navn}</td>
      <td>{person?.fnr}</td>
      <td>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</td>
      <td>{utfallName}</td>
      <td>
        <NavLink className="knapp knapp--hoved" to={`/klagebehandling/${id}`}>
          Åpne
        </NavLink>
      </td>
    </tr>
  );
};
