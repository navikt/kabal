import { Table } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useFullYtelseNameFromId, useInnsendingshjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { useUtfall } from '../../simple-api-state/use-kodeverk';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { IOppgave } from '../../types/oppgaver';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { PaaVent } from '../common-table-components/paa-vent';
import { CopyFnrButton } from '../copy-button/copy-fnr-button';
import { Type } from '../type/type';

export const Row = ({
  id,
  type,
  utfall,
  hjemmel,
  person,
  ytelse,
  sattPaaVent,
  tildeltSaksbehandlerident,
  medunderskriverident,
}: IOppgave): JSX.Element => {
  const { data: utfallList } = useUtfall();

  const utfallName = useMemo(() => {
    if (typeof utfallList === 'undefined') {
      return '';
    }

    return utfallList.find((u) => u.id === utfall)?.navn;
  }, [utfallList, utfall]);

  return (
    <Table.Row>
      <Table.DataCell>
        <Type type={type} />
      </Table.DataCell>
      <Table.DataCell>
        <LabelTema>{useFullYtelseNameFromId(ytelse)}</LabelTema>
      </Table.DataCell>
      <Table.DataCell>
        <LabelMain>{useInnsendingshjemmelFromId(hjemmel)}</LabelMain>
      </Table.DataCell>
      <Table.DataCell>{person?.navn}</Table.DataCell>
      <Table.DataCell>
        <CopyFnrButton fnr={person?.fnr} />
      </Table.DataCell>
      <Table.DataCell>
        <PaaVent sattPaaVent={sattPaaVent} />
      </Table.DataCell>
      <Table.DataCell>{utfallName}</Table.DataCell>
      <Table.DataCell>
        <OpenOppgavebehandling
          oppgavebehandlingId={id}
          ytelse={ytelse}
          type={type}
          tildeltSaksbehandlerident={tildeltSaksbehandlerident}
          medunderskriverident={medunderskriverident}
        />
      </Table.DataCell>
    </Table.Row>
  );
};
