import { Table } from '@navikt/ds-react';
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
    <Table.Row data-testid="enhetens-oppgaver-paa-vent-table-row" data-klagebehandlingid={id}>
      <Table.DataCell>
        <Type type={type} />
      </Table.DataCell>
      <Table.DataCell>
        <Ytelse ytelseId={ytelse} />
      </Table.DataCell>
      <Table.DataCell>
        <Hjemmel hjemmel={hjemmel} />
      </Table.DataCell>
      <Table.DataCell>
        <PaaVent sattPaaVent={sattPaaVent} />
      </Table.DataCell>
      <Table.DataCell>{utfallName}</Table.DataCell>
      <Table.DataCell>{tildeltSaksbehandlerNavn}</Table.DataCell>
      <Table.DataCell>
        <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
      </Table.DataCell>
    </Table.Row>
  );
};
