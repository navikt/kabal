import type { IOppgave } from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const oppgaveDataQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgave: builder.query<IOppgave, string>({
      query: (oppgaveId) => `/kabal-api/oppgaver/${oppgaveId}`,
    }),
  }),
});

export const { useGetOppgaveQuery } = oppgaveDataQuerySlice;
