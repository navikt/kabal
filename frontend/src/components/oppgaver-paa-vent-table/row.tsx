import React, { useMemo } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';
import { formatPersonNum } from '../../functions/format-id';
import { useFullYtelseNameFromId, useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { IOppgave } from '../../types/oppgaver';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { Type } from '../type/type';

export const Row = ({ id, type, utfall, hjemmel, person, ytelse, sattPaaVent }: IOppgave): JSX.Element => {
  const utfallList = useKodeverkValue('utfall');

  const utfallName = useMemo(() => {
    if (typeof utfallList === 'undefined') {
      return '';
    }

    return utfallList.find((u) => u.id === utfall)?.navn;
  }, [utfallList, utfall]);

  const PaaVent = sattPaaVent?.isExpired === true ? Expired : NonExpired;

  return (
    <tr>
      <td>
        <Type type={type} />
      </td>
      <td>
        <LabelTema>{useFullYtelseNameFromId(ytelse)}</LabelTema>
      </td>
      <td>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
      </td>
      <td>{person?.navn}</td>
      <td>{formatPersonNum(person?.fnr)}</td>
      <PaaVent>{isoDateToPretty(sattPaaVent?.to ?? null)}</PaaVent>
      <td>{utfallName}</td>
      <td>
        <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
      </td>
    </tr>
  );
};

const NonExpired = styled.td``;

const Expired = styled(NonExpired)`
  color: #c30000;
`;
