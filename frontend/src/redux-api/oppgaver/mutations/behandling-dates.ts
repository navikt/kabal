import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { reduxStore } from '@app/redux/configure-store';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import type {
  IFristParams,
  IKjennelseMottattParams,
  IMottattKlageinstansParams,
  IMottattVedtaksinstansParams,
  ISendtTilTrygderettenParams,
} from '@app/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@app/types/oppgavebehandling/response';
import type { IOppgave } from '@app/types/oppgaver';
import { toast } from './../../../components/toast/store';
import { isoDateToPretty } from './../../../domain/date';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setFrist: builder.mutation<IModifiedResponse, IFristParams>({
      query: ({ oppgaveId, date }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/frist`,
        method: 'PUT',
        body: { date },
      }),
      onQueryStarted: async ({ oppgaveId, date }, { queryFulfilled }) => {
        const undoBehandling = updateBehandling(oppgaveId, [['frist', date]]);
        const undoOppgaveData = updateOppgaveData(oppgaveId, [['frist', date]]);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]]);
          successToast('Frist', date);
        } catch (error) {
          undoBehandling();
          undoOppgaveData();

          const heading = 'Kunne ikke oppdatere frist';
          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    setMottattKlageinstans: builder.mutation<IModifiedResponse, IMottattKlageinstansParams>({
      query: ({ oppgaveId, mottattKlageinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattklageinstans`,
        method: 'PUT',
        body: { date: mottattKlageinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattKlageinstans }, { queryFulfilled }) => {
        const undoBehandling = updateBehandling(oppgaveId, [['mottattKlageinstans', mottattKlageinstans]]);
        const undoOppgaveData = updateOppgaveData(oppgaveId, [['mottatt', mottattKlageinstans]]);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]]);
          successToast('Mottatt klageinstans', mottattKlageinstans);
        } catch (error) {
          undoBehandling();
          undoOppgaveData();

          const heading = 'Kunne ikke oppdatere mottatt klageinstans';
          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    setMottattVedtaksinstans: builder.mutation<IModifiedResponse, IMottattVedtaksinstansParams>({
      query: ({ oppgaveId, mottattVedtaksinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattvedtaksinstans`,
        method: 'PUT',
        body: { date: mottattVedtaksinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattVedtaksinstans }, { queryFulfilled }) => {
        const undo = updateBehandling(oppgaveId, [['mottattVedtaksinstans', mottattVedtaksinstans]]);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]]);
          successToast('Mottatt vedtaksinstans', mottattVedtaksinstans);
        } catch (error) {
          undo();

          const heading = 'Kunne ikke oppdatere mottatt vedtaksinstans';
          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
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
      onQueryStarted: async ({ oppgaveId, kjennelseMottatt, typeId }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.typeId === typeId) {
              draft.kjennelseMottatt = kjennelseMottatt;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]]);
          successToast('Kjennelse mottatt', kjennelseMottatt);
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke oppdatere kjennelse mottatt';
          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
    setSendtTilTrygderetten: builder.mutation<IModifiedResponse, ISendtTilTrygderettenParams>({
      query: ({ oppgaveId, sendtTilTrygderetten }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/sendttiltrygderetten`,
        method: 'PUT',
        body: { date: sendtTilTrygderetten },
      }),
      onQueryStarted: async ({ oppgaveId, sendtTilTrygderetten, typeId }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.typeId === typeId) {
              draft.sendtTilTrygderetten = sendtTilTrygderetten;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]]);
          successToast('Sendt til Trygderetten', sendtTilTrygderetten);
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke oppdatere sendt til Trygderetten';
          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

const updateBehandling = <K extends keyof IOppgavebehandling>(
  oppgaveId: string,
  values: [K, IOppgavebehandling[K]][],
) => {
  const patchResult = reduxStore.dispatch(
    behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
      for (const [key, value] of values) {
        draft[key] = value;
      }
    }),
  );

  return patchResult.undo;
};

const updateOppgaveData = <K extends keyof IOppgave>(oppgaveId: string, values: [K, IOppgave[K]][]) => {
  const patchResult = reduxStore.dispatch(
    oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
      for (const [key, value] of values) {
        draft[key] = value;
      }
    }),
  );

  return patchResult.undo;
};

const successToast = (name: string, dateString: string | null) => {
  const formattedName = name.includes(' ') ? `"${name}"` : name;

  toast.success(
    dateString === null
      ? `${formattedName} fjernet`
      : `${formattedName} oppdatert til ${isoDateToPretty(dateString) ?? dateString}`,
  );
};

export const {
  useSetMottattKlageinstansMutation,
  useSetMottattVedtaksinstansMutation,
  useSetFristMutation,
  useSetKjennelseMottattMutation,
  useSetSendtTilTrygderettenMutation,
} = behandlingerMutationSlice;
