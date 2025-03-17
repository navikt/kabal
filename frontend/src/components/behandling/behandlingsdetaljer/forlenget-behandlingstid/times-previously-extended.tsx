import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetOrCreateQuery } from '@app/redux-api/forlenget-behandlingstid';
import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

export const TimesPreviouslyExtended = () => {
  const id = useOppgaveId();
  const { data, isSuccess } = useGetOrCreateQuery(id ?? skipToken);

  if (id === skipToken || !isSuccess || data.timesPreviouslyExtended === 0) {
    return null;
  }

  if (data.timesPreviouslyExtended === 1) {
    return (
      <Alert size="small" variant="warning">
        Varslet frist i Kabal har blitt endret <b>1</b> gang.
      </Alert>
    );
  }

  return (
    <Alert size="small" variant="warning">
      Varslet frist i Kabal har blitt endret <b>{data.timesPreviouslyExtended}</b> ganger.
    </Alert>
  );
};
