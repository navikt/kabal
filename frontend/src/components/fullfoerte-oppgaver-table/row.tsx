import React, { useMemo } from 'react';
import { isoDateToPretty } from '../../domain/date';
import { formatPersonNum } from '../../functions/format-id';
import { useFullYtelseNameFromId, useHjemmelFromId, useTypeNameFromId } from '../../hooks/use-kodeverk-ids';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { IOppgave } from '../../types/oppgaver';
import { OpenKlagebehandling } from '../common-table-components/open';

export const Row = ({
  id,
  type,
  utfall,
  hjemmel,
  avsluttetAvSaksbehandlerDate,
  person,
  ytelse,
}: IOppgave): JSX.Element => {
  const utfallList = useKodeverkValue('utfall');

  const utfallName = useMemo(() => {
    if (typeof utfallList === 'undefined') {
      return '';
    }

    return utfallList.find((u) => u.id === utfall)?.navn;
  }, [utfallList, utfall]);

  return (
    <tr>
      <td>
        <LabelMain>{useTypeNameFromId(type)}</LabelMain>
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
