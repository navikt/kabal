import { Table } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { isoDateToPretty } from '../../domain/date';
import { useFullYtelseNameFromId, useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { IOppgave } from '../../types/oppgaver';
import { OpenOppgavebehandling } from '../common-table-components/open';
import { CopyFnrButton } from '../copy-button/copy-fnr-button';
import { Type } from '../type/type';

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
    <Table.Row>
      <Table.DataCell>
        <Type type={type} />
      </Table.DataCell>
      <Table.DataCell>
        <LabelTema>{useFullYtelseNameFromId(ytelse)}</LabelTema>
      </Table.DataCell>
      <Table.DataCell>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
      </Table.DataCell>
      <Table.DataCell>{person?.navn}</Table.DataCell>
      <Table.DataCell>
        <CopyFnrButton fnr={person?.fnr} />
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</Table.DataCell>
      <Table.DataCell>{utfallName}</Table.DataCell>
      <Table.DataCell>
        <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
      </Table.DataCell>
    </Table.Row>
  );
};
