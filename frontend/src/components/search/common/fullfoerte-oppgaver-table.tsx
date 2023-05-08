import { Alert, Heading, Table } from '@navikt/ds-react';
import React from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { LoadingRow } from '@app/components/common-table-components/loading-row';
import { isoDateToPretty } from '@app/domain/date';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetOppgaveQuery } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { Ytelse } from '../../common-table-components/ytelse';
import { Type } from '../../type/type';

interface Props {
  finishedOppgaver: string[];
}

export const FullfoerteOppgaverTable = ({ finishedOppgaver }: Props) => {
  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.SEARCH_DONE, finishedOppgaver);

  if (finishedOppgaver.length === 0) {
    return <Alert variant="info">Ingen fullførte oppgaver siste 12 måneder</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Fullførte oppgaver siste 12 måneder</Heading>
      <Table data-testid="search-result-fullfoerte-oppgaver" zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Ytelse</Table.ColumnHeader>
            <Table.ColumnHeader>Hjemmel</Table.ColumnHeader>
            <Table.ColumnHeader>Fullført</Table.ColumnHeader>
            <Table.ColumnHeader>Saksbehandler</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.map((id) => (
            <Row oppgaveId={id} columnCount={7} key={id} />
          ))}
        </Table.Body>
        <TableFooter {...footerProps} columnCount={8} settingsKey={OppgaveTableRowsPerPage.SEARCH_DONE} />
      </Table>
    </div>
  );
};

interface RowProps {
  oppgaveId: string;
  columnCount: number;
}

const Row = ({ oppgaveId, columnCount }: RowProps) => {
  const { data: oppgave, isLoading } = useGetOppgaveQuery(oppgaveId);

  if (isLoading || typeof oppgave === 'undefined') {
    return <LoadingRow columnCount={columnCount} testId="search-result-fullfoert-oppgave" behandlingid={oppgaveId} />;
  }

  const {
    id,
    type,
    hjemmel,
    ytelse,
    avsluttetAvSaksbehandlerDate,
    tildeltSaksbehandlerNavn,
    tildeltSaksbehandlerident,
    medunderskriverident,
  } = oppgave;

  return (
    <Table.Row data-testid="search-result-fullfoert-oppgave">
      <Table.DataCell>
        <Type type={type} />
      </Table.DataCell>
      <Table.DataCell>
        <Ytelse ytelseId={ytelse} />
      </Table.DataCell>
      <Table.DataCell>
        <Hjemmel hjemmel={hjemmel} />
      </Table.DataCell>
      <Table.DataCell>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</Table.DataCell>
      <Table.DataCell>{tildeltSaksbehandlerNavn}</Table.DataCell>
      <Table.DataCell align="right">
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
