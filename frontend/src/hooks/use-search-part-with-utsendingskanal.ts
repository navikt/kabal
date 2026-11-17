import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSearchPartWithUtsendingskanalQuery } from '@/redux-api/search';

export const useSearchPartWithUtsendingskanal = (identifikator: string | null | undefined | typeof skipToken) => {
  const { currentData } = useOppgave();

  return useSearchPartWithUtsendingskanalQuery(
    currentData !== undefined && typeof identifikator === 'string'
      ? {
          identifikator,
          sakenGjelderId: currentData.sakenGjelder.identifikator,
          ytelseId: currentData.ytelseId,
        }
      : skipToken,
  );
};
