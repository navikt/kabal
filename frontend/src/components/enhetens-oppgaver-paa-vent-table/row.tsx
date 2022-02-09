import React, { useMemo } from 'react';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { IOppgave } from '../../types/oppgaver';
import { Hjemmel } from '../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { PaaVent } from '../common-table-components/paa-vent';
import { Ytelse } from '../common-table-components/ytelse';
import { Type } from '../type/type';

export const Row = ({
  id,
  type,
  utfall,
  hjemmel,
  ytelse,
  sattPaaVent,
  tildeltSaksbehandlerNavn,
}: IOppgave): JSX.Element => {
  const utfallList = useKodeverkValue('utfall');

  const utfallName = useMemo(() => {
    if (typeof utfallList === 'undefined') {
      return '';
    }

    return utfallList.find((u) => u.id === utfall)?.navn;
  }, [utfallList, utfall]);

  return (
    <tr data-testid="enhetens-oppgaver-paa-vent-table-row" data-klagebehandlingid={id}>
      <td>
        <Type type={type} />
      </td>
      <td>
        <Ytelse ytelseId={ytelse} />
      </td>
      <td>
        <Hjemmel hjemmel={hjemmel} />
      </td>
      <td>
        <PaaVent sattPaaVent={sattPaaVent} />
      </td>
      <td>{utfallName}</td>
      <td>{tildeltSaksbehandlerNavn}</td>
      <td>
        <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
      </td>
    </tr>
  );
};
