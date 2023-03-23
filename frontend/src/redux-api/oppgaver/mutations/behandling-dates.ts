import { ToastType } from '@app/components/toast/types';
import { reduxStore } from '@app/redux/configure-store';
import { isApiError } from '@app/types/errors';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import {
  IFristParams,
  IKjennelseMottattParams,
  IMottattKlageinstansParams,
  IMottattVedtaksinstansParams,
  ISendtTilTrygderettenParams,
} from '@app/types/oppgavebehandling/params';
import { IModifiedResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';
import { toast } from './../../../components/toast/store';
import { isoDateToPretty } from './../../../domain/date';
import { getInvalidateAction } from './behandling-helpers';

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setFrist: builder.mutation<IModifiedResponse, IFristParams>({
      query: ({ oppgaveId, date }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/frist`,
        method: 'PUT',
        body: { date },
      }),
      onQueryStarted: async ({ oppgaveId, date }, { queryFulfilled, dispatch }) => {
        const undo = update(oppgaveId, [['frist', date]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
          dispatch(getInvalidateAction(oppgaveId));
          successToast('Frist', date);
        } catch (e) {
          errorToast(e, 'frist');
          undo();
        }
      },
    }),
    setMottattKlageinstans: builder.mutation<IModifiedResponse, IMottattKlageinstansParams>({
      query: ({ oppgaveId, mottattKlageinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattklageinstans`,
        method: 'PUT',
        body: { date: mottattKlageinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattKlageinstans }, { dispatch, queryFulfilled }) => {
        const undo = update(oppgaveId, [['mottattKlageinstans', mottattKlageinstans]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
          dispatch(getInvalidateAction(oppgaveId));

          successToast('Mottatt klageinstans', mottattKlageinstans);
        } catch (e) {
          errorToast(e, 'Mottatt klageinstans');
          undo();
        }
      },
    }),
    setMottattVedtaksinstans: builder.mutation<IModifiedResponse, IMottattVedtaksinstansParams>({
      query: ({ oppgaveId, mottattVedtaksinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattvedtaksinstans`,
        method: 'PUT',
        body: { date: mottattVedtaksinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattVedtaksinstans }, { dispatch, queryFulfilled }) => {
        const undo = update(oppgaveId, [['mottattVedtaksinstans', mottattVedtaksinstans]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
          dispatch(getInvalidateAction(oppgaveId));
          successToast('Mottatt vedtaksinstans', mottattVedtaksinstans);
        } catch (e) {
          errorToast(e, 'Mottatt vedtaksinstans');
          undo();
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
          successToast('Kjennelse mottatt', kjennelseMottatt);
        } catch (e) {
          errorToast(e, 'Kjennelse mottatt');
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
          successToast('Sendt til Trygderetten', sendtTilTrygderetten);
        } catch (e) {
          errorToast(e, 'Sendt til Trygderetten');
          patchResult.undo();
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

const successToast = (name: string, dateString: string | null) => {
  const formattedName = name.includes(' ') ? `"${name}"` : name;
  const message =
    dateString === null
      ? `${formattedName} fjernet`
      : `${formattedName} oppdatert til ${isoDateToPretty(dateString) ?? dateString}`;

  toast({ type: ToastType.SUCCESS, message });
};

const errorToast = (e: unknown, name: string) => {
  const formattedName = name.includes(' ') ? `"${name}"` : name;

  if (isApiError(e)) {
    toast({ type: ToastType.ERROR, message: `Feil ved oppdatering av ${formattedName}: ${e.detail}` });
  } else {
    toast({ type: ToastType.ERROR, message: `Feil ved oppdatering av ${formattedName}` });
  }
};

export const {
  useSetMottattKlageinstansMutation,
  useSetMottattVedtaksinstansMutation,
  useSetFristMutation,
  useSetKjennelseMottattMutation,
  useSetSendtTilTrygderettenMutation,
} = behandlingerMutationSlice;
