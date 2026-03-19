import { skipToken } from '@reduxjs/toolkit/query';
import { Alert } from '@/components/alert/alert';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useGetOrCreateQuery } from '@/redux-api/forlenget-behandlingstid';

export const TimesPreviouslyExtended = () => {
  const id = useOppgaveId();
  const { data, isSuccess } = useGetOrCreateQuery(id ?? skipToken);

  if (id === skipToken || !isSuccess || data.timesPreviouslyExtended === 0) {
    return null;
  }

  if (data.timesPreviouslyExtended === 1) {
    return (
      <Alert variant="warning">
        Varslet frist i Kabal har blitt endret <b>1</b> gang.
      </Alert>
    );
  }

  return (
    <Alert variant="warning">
      Varslet frist i Kabal har blitt endret <b>{data.timesPreviouslyExtended}</b> ganger.
    </Alert>
  );
};
