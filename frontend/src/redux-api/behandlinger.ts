import { createApi } from '@reduxjs/toolkit/query/react';
import { IApiValidationResponse } from '../functions/error-type-guard';
import { OppgaveType } from '../types/kodeverk';
import {
  IMottattKlageinstansParams,
  IMottattVedtaksinstansParams,
  IOppgavebehandlingHjemlerUpdateParams,
} from '../types/oppgavebehandling-params';
import { IModifiedResponse, IVedtakFullfoertResponse } from '../types/oppgavebehandling-response';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { oppgavebehandlingApi } from './oppgavebehandling';
import { oppgaverApi } from './oppgaver';

export const behandlingerApi = createApi({
  reducerPath: 'behandlingerApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    validate: builder.query<IApiValidationResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/fullfoer`,
        method: 'POST',
      }),
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.modified = data.modified;
            draft.isAvsluttetAvSaksbehandler = data.isAvsluttetAvSaksbehandler;
          })
        );
        oppgavebehandlingApi.util.invalidateTags(['oppgavebehandling']);
      },
    }),
    setMottattKlageinstans: builder.mutation<IModifiedResponse, IMottattKlageinstansParams>({
      query: ({ oppgaveId, mottattKlageinstans }) => ({
        url: `/${oppgaveId}/mottattklageinstans`,
        method: 'PUT',
        body: {
          date: mottattKlageinstans,
        },
      }),
      onQueryStarted: async ({ oppgaveId, mottattKlageinstans, type }, { dispatch, queryFulfilled }) => {
        if (type === OppgaveType.ANKE) {
          const getOppgavebehandlingPatchResult = dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.mottattKlageinstans = mottattKlageinstans;
            })
          );

          try {
            await queryFulfilled;
            dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver', 'enhetens-tildelte-oppgaver']));
          } catch {
            getOppgavebehandlingPatchResult.undo();
          }
        }
      },
    }),
    setMottattVedtaksinstans: builder.mutation<IModifiedResponse, IMottattVedtaksinstansParams>({
      query: ({ oppgaveId, mottattVedtaksinstans }) => ({
        url: `/${oppgaveId}/mottattvedtaksinstans`,
        method: 'PUT',
        body: {
          date: mottattVedtaksinstans,
        },
      }),
      onQueryStarted: async ({ oppgaveId, mottattVedtaksinstans, type }, { dispatch, queryFulfilled }) => {
        if (type === OppgaveType.KLAGE) {
          const getOppgavebehandlingPatchResult = dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.mottattVedtaksinstans = mottattVedtaksinstans;
            })
          );

          try {
            await queryFulfilled;
            dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver', 'enhetens-tildelte-oppgaver']));
          } catch {
            getOppgavebehandlingPatchResult.undo();
          }
        }
      },
    }),
    updateInnsendingshjemler: builder.mutation<{ modified: string }, IOppgavebehandlingHjemlerUpdateParams>({
      query: ({ oppgaveId, hjemler }) => ({
        url: `/${oppgaveId}/innsendingshjemler`,
        method: 'PUT',
        body: { hjemler },
      }),
      onQueryStarted: async ({ oppgaveId, hjemler }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.hjemler = hjemler;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useFinishOppgavebehandlingMutation,
  useValidateQuery,
  useLazyValidateQuery,
  useSetMottattKlageinstansMutation,
  useSetMottattVedtaksinstansMutation,
  useUpdateInnsendingshjemlerMutation,
} = behandlingerApi;
