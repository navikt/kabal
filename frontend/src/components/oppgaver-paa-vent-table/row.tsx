import React, { useMemo } from 'react';
import { useFullYtelseNameFromId, useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { IOppgave } from '../../types/oppgaver';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { PaaVent } from '../common-table-components/paa-vent';
import { CopyFnrButton } from '../copy-button/copy-fnr-button';
import { Type } from '../type/type';

export const Row = ({ id, type, utfall, hjemmel, person, ytelse, sattPaaVent }: IOppgave): JSX.Element => {
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
        <Type type={type} />
      </td>
      <td>
        <LabelTema>{useFullYtelseNameFromId(ytelse)}</LabelTema>
      </td>
      <td>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
      </td>
      <td>{person?.navn}</td>
      <td>
        <CopyFnrButton fnr={person?.fnr} />
      </td>
      <td>
        <PaaVent sattPaaVent={sattPaaVent} />
      </td>
      <td>{utfallName}</td>
      <td>
        <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
      </td>
    </tr>
  );
};
