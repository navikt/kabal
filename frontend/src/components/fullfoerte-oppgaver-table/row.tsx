import React, { useMemo } from 'react';
import { isoDateToPretty } from '../../domain/date';
import { formatPersonNum } from '../../functions/format-id';
import { useFullYtelseNameFromId, useHjemmelFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { OpenKlagebehandling } from '../common-table-components/open';

export const Row = ({
  id,
  type,
  utfall,
  hjemmel,
  avsluttetAvSaksbehandlerDate,
  person,
  ytelse,
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
        <LabelTema>{useFullYtelseNameFromId(ytelse)}</LabelTema>
      </td>
      <td>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
      </td>
      <td>{person?.navn}</td>
      <td>{formatPersonNum(person?.fnr)}</td>
      <td>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</td>
      <td>{utfallName}</td>
      <td>
        <OpenKlagebehandling klagebehandlingId={id} ytelse={ytelse} />
      </td>
    </tr>
  );
};
