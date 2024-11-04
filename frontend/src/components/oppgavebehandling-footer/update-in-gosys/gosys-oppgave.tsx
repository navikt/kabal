import {
  DateCell,
  Employee,
  Enhet,
  TimeCell,
} from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/row';
import { GosysBeskrivelseTabs } from '@app/components/gosys/beskrivelse/beskrivelse-tabs';
import { useFullTemaNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { GosysStatus, type IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Table, Tag } from '@navikt/ds-react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const GosysOppgave = ({ oppgavebehandling }: Props) => {
  const { data } = useGetGosysOppgaveQuery(oppgavebehandling.id);
  const temaName = useFullTemaNameFromIdOrLoading(data?.temaId ?? null);

  if (data === undefined) {
    return null;
  }

  const isFerdigstilt = data.status === GosysStatus.FERDIGSTILT;

  return (
    <Table size="small">
      <TableHeader isFerdigstilt={isFerdigstilt} />
      <Table.Body>
        <Table.ExpandableRow content={<GosysBeskrivelseTabs id={data.id} beskrivelse={data.beskrivelse} />}>
          <Table.DataCell>
            {data.gjelder === null ? null : (
              <Tag size="small" variant="success">
                {data.gjelder}
              </Tag>
            )}
          </Table.DataCell>

          <Table.DataCell>
            <Tag size="small" variant="alt1">
              {temaName}
            </Tag>
          </Table.DataCell>

          {isFerdigstilt ? <TimeCell time={data.ferdigstiltTidspunkt} /> : null}

          <DateCell date={data.fristFerdigstillelse} />

          <Table.DataCell>
            <Tag size="small" variant="info">
              {data.oppgavetype}
            </Tag>
          </Table.DataCell>

          <Table.DataCell>
            <Employee employee={data.opprettetAv} />
          </Table.DataCell>

          <Table.DataCell>
            {data.opprettetAvEnhet === null ? null : (
              <Tag size="small" variant="alt1">
                {data.opprettetAvEnhet.navn} ({data.opprettetAvEnhet.enhetsnr})
              </Tag>
            )}
          </Table.DataCell>

          <Table.DataCell>
            <Enhet enhet={data.tildeltEnhetsnr} />
          </Table.DataCell>
        </Table.ExpandableRow>
      </Table.Body>
    </Table>
  );
};

interface HeaderProps {
  isFerdigstilt: boolean;
}

const TableHeader = ({ isFerdigstilt }: HeaderProps) => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader />

        <Table.HeaderCell>Gjelder</Table.HeaderCell>
        <Table.HeaderCell>Tema</Table.HeaderCell>
        {isFerdigstilt ? <Table.HeaderCell>Ferdigstilt</Table.HeaderCell> : null}
        <Table.HeaderCell>Frist</Table.HeaderCell>
        <Table.HeaderCell>Oppgavetype</Table.HeaderCell>
        <Table.HeaderCell>Opprettet av</Table.HeaderCell>
        <Table.HeaderCell>Opprettet av enhet</Table.HeaderCell>
        <Table.HeaderCell>Tildelt enhet</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};
