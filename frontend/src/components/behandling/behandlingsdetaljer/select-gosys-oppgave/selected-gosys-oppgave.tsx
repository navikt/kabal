import { Loader, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Row } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/row';
import { TableHeader } from '@/components/gosys-oppgave-table/table-header';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useGetGosysOppgaveQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';

export const SelectedGosysOppgave = () => {
  const id = useOppgaveId();
  const { data: gosysOppgave, isLoading, isSuccess } = useGetGosysOppgaveQuery(id);
  const canEdit = useIsTildeltSaksbehandler();

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
        <Row
          gosysOppgave={gosysOppgave}
          oppgaveId={id}
          selectedGosysOppgave={gosysOppgave}
          showFerdigstilt
          canEdit={canEdit}
        />
      </Table.Body>
    </Table>
  );
};
