import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import type { ISetMuFlowStateParams } from '@/types/oppgavebehandling/params';
import type { ISetMuFlowStateResponse } from '@/types/oppgavebehandling/response';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setMedunderskriverFlowState: builder.mutation<ISetMuFlowStateResponse, ISetMuFlowStateParams>({
      query: ({ oppgaveId, flowState }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/medunderskriverflowstate`,
        method: 'PUT',
        body: { flowState },
      }),
    }),
  }),
});

export const { useSetMedunderskriverFlowStateMutation } = setMedunderskriverMutationSlice;
