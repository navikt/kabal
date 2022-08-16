import { FradelSaksbehandlerParams, ISaksbehandlerResponse, TildelSaksbehandlerParams } from '../../../types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

const ansatteMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    tildelSaksbehandler: builder.mutation<ISaksbehandlerResponse, TildelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent, enhetId }) => ({
        url: `/kabal-api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlertildeling`,
        method: 'POST',
        body: {
          navIdent,
          enhetId,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver']));
        await delay(3000);
        dispatch(oppgaverApi.util.invalidateTags(['ledige-oppgaver']));
      },
    }),

    fradelSaksbehandler: builder.mutation<ISaksbehandlerResponse, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/kabal-api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlerfradeling`,
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(oppgaverApi.util.invalidateTags(['ledige-oppgaver']));
        await delay(3000);
        dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver']));
      },
    }),
  }),
});

export const { useTildelSaksbehandlerMutation, useFradelSaksbehandlerMutation } = ansatteMutationSlice;

const delay = async (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
