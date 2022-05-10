import { IApiValidationResponse } from '../../../functions/error-type-guard';
import { IOppgavebehandling } from '../../../types/oppgavebehandling/oppgavebehandling';
import { IMedunderskriverResponse, IMedunderskriverflytResponse } from '../../../types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const behandlingerQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgavebehandling: builder.query<IOppgavebehandling, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/detaljer`,
      providesTags: ['oppgavebehandling'],
    }),
    getMedunderskriver: builder.query<IMedunderskriverResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriver`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.medunderskriver = data.medunderskriver;
            }
          })
        );
      },
    }),
    getMedunderskriverflyt: builder.query<IMedunderskriverflytResponse, string>({
      query: (oppgaveId) => `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriverflyt`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            }
          })
        );
      },
    }),
    validate: builder.query<IApiValidationResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
  }),
});

export const {
  useGetOppgavebehandlingQuery,
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
  useValidateQuery,
  useLazyValidateQuery,
} = behandlingerQuerySlice;
