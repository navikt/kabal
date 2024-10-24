import { Row } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/row';
import { TableHeader } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/table-header';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Loader, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

export const SelectedGosysOppgave = () => {
  const id = useOppgaveId();
  const { data: gosysOppgave, isLoading, isSuccess } = useGetGosysOppgaveQuery(id);

  if (isLoading) {
    return <Loader title="Laster..." />;
  }

  if (!isSuccess || id === skipToken) {
    return null;
  }

  return (
    <Table zebraStripes size="small">
      <TableHeader showFerdigstilt />
      <Table.Body>
        <Row gosysOppgave={gosysOppgave} oppgaveId={id} selectedGosysOppgave={gosysOppgave} showFerdigstilt />
      </Table.Body>
    </Table>
  );
};
