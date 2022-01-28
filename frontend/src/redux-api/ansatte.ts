import { createApi } from '@reduxjs/toolkit/query/react';
import { FradelSaksbehandlerParams, ISaksbehandlerResponse, TildelSaksbehandlerParams } from '../types/oppgaver';
import { KABAL_ANSATTE_BASE_QUERY } from './common';
import { oppgaverApi } from './oppgaver';

export const ansatteApi = createApi({
  reducerPath: 'ansatteApi',
  baseQuery: KABAL_ANSATTE_BASE_QUERY,
  endpoints: (builder) => ({
    tildelSaksbehandler: builder.mutation<ISaksbehandlerResponse, TildelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent, enhetId }) => ({
        url: `/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlertildeling`,
        method: 'POST',
        body: {
          navIdent,
          enhetId,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        await delay(3000);
        dispatch(oppgaverApi.util.invalidateTags(['ledige-oppgaver']));
      },
    }),
    fradelSaksbehandler: builder.mutation<ISaksbehandlerResponse, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlerfradeling`,
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        await delay(3000);
        dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver']));
      },
    }),
  }),
});

export const { useTildelSaksbehandlerMutation, useFradelSaksbehandlerMutation } = ansatteApi;

const delay = async (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
