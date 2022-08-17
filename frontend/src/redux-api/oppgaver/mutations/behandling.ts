import { reduxStore } from '../../../redux/configure-store';
import { OppgaveType } from '../../../types/kodeverk';
import { IOppgavebehandling } from '../../../types/oppgavebehandling/oppgavebehandling';
import {
  IKjennelseMottattParams,
  IMottattKlageinstansParams,
  IMottattVedtaksinstansParams,
  IOppgavebehandlingHjemlerUpdateParams,
  ISendtTilTrygderettenParams,
} from '../../../types/oppgavebehandling/params';
import { IModifiedResponse, IVedtakFullfoertResponse } from '../../../types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer`,
        method: 'POST',
      }),
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async (oppgaveId, { queryFulfilled }) => {
        const { data } = await queryFulfilled;
        update(oppgaveId, [
          ['modified', data.modified],
          ['isAvsluttetAvSaksbehandler', data.isAvsluttetAvSaksbehandler],
        ]);
        oppgaverApi.util.invalidateTags(['oppgavebehandling']);
      },
    }),
    setMottattKlageinstans: builder.mutation<IModifiedResponse, IMottattKlageinstansParams>({
      query: ({ oppgaveId, mottattKlageinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattklageinstans`,
        method: 'PUT',
        body: {
          date: mottattKlageinstans,
        },
      }),
      onQueryStarted: async ({ oppgaveId, mottattKlageinstans, type }, { dispatch, queryFulfilled }) => {
        if (type === OppgaveType.ANKE) {
          const undo = update(oppgaveId, [['mottattKlageinstans', mottattKlageinstans]]);

          try {
            const { data } = await queryFulfilled;
            update(oppgaveId, [['modified', data.modified]]);
            dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver', 'enhetens-tildelte-oppgaver']));
          } catch {
            undo();
          }
        }
      },
    }),
    setMottattVedtaksinstans: builder.mutation<IModifiedResponse, IMottattVedtaksinstansParams>({
      query: ({ oppgaveId, mottattVedtaksinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattvedtaksinstans`,
        method: 'PUT',
        body: {
          date: mottattVedtaksinstans,
        },
      }),
      onQueryStarted: async ({ oppgaveId, mottattVedtaksinstans, type }, { dispatch, queryFulfilled }) => {
        if (type === OppgaveType.KLAGE) {
          const undo = update(oppgaveId, [['mottattVedtaksinstans', mottattVedtaksinstans]]);

          try {
            const { data } = await queryFulfilled;
            update(oppgaveId, [['modified', data.modified]]);
            dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver', 'enhetens-tildelte-oppgaver']));
          } catch {
            undo();
          }
        }
      },
    }),
    setKjennelseMottatt: builder.mutation<IModifiedResponse, IKjennelseMottattParams>({
      query: ({ oppgaveId, kjennelseMottatt }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/kjennelsemottatt`,
        method: 'PUT',
        body: { date: kjennelseMottatt },
      }),
      onQueryStarted: async ({ oppgaveId, kjennelseMottatt, type }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.type === type) {
              draft.kjennelseMottatt = kjennelseMottatt;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
        } catch {
          patchResult.undo();
        }
      },
    }),
    setSendtTilTrygderetten: builder.mutation<IModifiedResponse, ISendtTilTrygderettenParams>({
      query: ({ oppgaveId, sendtTilTrygderetten }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/sendttiltrygderetten`,
        method: 'PUT',
        body: { date: sendtTilTrygderetten },
      }),
      onQueryStarted: async ({ oppgaveId, sendtTilTrygderetten, type }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.type === type) {
              draft.sendtTilTrygderetten = sendtTilTrygderetten;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateInnsendingshjemler: builder.mutation<IModifiedResponse, IOppgavebehandlingHjemlerUpdateParams>({
      query: ({ oppgaveId, hjemler }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/innsendingshjemler`,
        method: 'PUT',
        body: { hjemler },
      }),
      onQueryStarted: async ({ oppgaveId, hjemler }, { queryFulfilled }) => {
        const undo = update(oppgaveId, [['hjemler', hjemler]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
        } catch {
          undo();
        }
      },
    }),
  }),
});

const update = <K extends keyof IOppgavebehandling>(oppgaveId: string, values: [K, IOppgavebehandling[K]][]) => {
  const patchResult = reduxStore.dispatch(
    behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
      values.forEach(([key, value]) => {
        draft[key] = value;
      });
    })
  );

  return patchResult.undo;
};

export const {
  useFinishOppgavebehandlingMutation,
  useSetMottattKlageinstansMutation,
  useSetMottattVedtaksinstansMutation,
  useUpdateInnsendingshjemlerMutation,
  useSetKjennelseMottattMutation,
  useSetSendtTilTrygderettenMutation,
} = behandlingerMutationSlice;
