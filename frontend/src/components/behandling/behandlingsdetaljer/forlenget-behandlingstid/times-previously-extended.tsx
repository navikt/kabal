import { skipToken } from '@reduxjs/toolkit/query';
import { InfoBox } from '@/components/info-box/info-box';
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
      <InfoBox variant="warning">
        Varslet frist i Kabal har blitt endret <b>1</b> gang.
      </InfoBox>
    );
  }

  return (
    <InfoBox variant="warning">
      Varslet frist i Kabal har blitt endret <b>{data.timesPreviouslyExtended}</b> ganger.
    </InfoBox>
  );
};
