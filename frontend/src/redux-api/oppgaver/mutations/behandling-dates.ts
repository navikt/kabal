import { toast } from '@/components/toast/store';
import { isoDateToPretty } from '@/domain/date';
import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import type { Dispatch } from '@/redux-api/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import type {
  IFristParams,
  IKjennelseMottattParams,
  IMottattKlageinstansParams,
  IMottattVedtaksinstansParams,
  IPaaanketVedtaksdatoParams,
  ISaksnummerHosTrygderettenParams,
  ISendtTilTrygderettenParams,
} from '@/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@/types/oppgavebehandling/response';
import type { IOppgave } from '@/types/oppgaver';

export const behandlingsdetaljerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setFrist: builder.mutation<IModifiedResponse, IFristParams>({
      query: ({ oppgaveId, date }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/frist`,
        method: 'PUT',
        body: { date },
      }),
      onQueryStarted: async ({ oppgaveId, date }, { queryFulfilled, dispatch }) => {
        const undoBehandling = updateBehandling(oppgaveId, [['frist', date]], dispatch);
        const undoOppgaveData = updateOppgaveData(oppgaveId, [['frist', date]], dispatch);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
          successToast('Frist', date);
        } catch {
          undoBehandling();
          undoOppgaveData();
        }
      },
    }),
    setMottattKlageinstans: builder.mutation<IModifiedResponse, IMottattKlageinstansParams>({
      query: ({ oppgaveId, mottattKlageinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattklageinstans`,
        method: 'PUT',
        body: { date: mottattKlageinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattKlageinstans }, { queryFulfilled, dispatch }) => {
        const undoBehandling = updateBehandling(oppgaveId, [['mottattKlageinstans', mottattKlageinstans]], dispatch);
        const undoOppgaveData = updateOppgaveData(oppgaveId, [['mottatt', mottattKlageinstans]], dispatch);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
          successToast('Mottatt klageinstans', mottattKlageinstans);
        } catch {
          undoBehandling();
          undoOppgaveData();
        }
      },
    }),
    setMottattVedtaksinstans: builder.mutation<IModifiedResponse, IMottattVedtaksinstansParams>({
      query: ({ oppgaveId, mottattVedtaksinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattvedtaksinstans`,
        method: 'PUT',
        body: { date: mottattVedtaksinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattVedtaksinstans }, { queryFulfilled, dispatch }) => {
        const undo = updateBehandling(oppgaveId, [['mottattVedtaksinstans', mottattVedtaksinstans]], dispatch);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
          successToast('Mottatt vedtaksinstans', mottattVedtaksinstans);
        } catch {
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
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
          successToast('Kjennelse mottatt', kjennelseMottatt);
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
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
          successToast('Sendt til Trygderetten', sendtTilTrygderetten);
        } catch {
          patchResult.undo();
        }
      },
    }),
    setPaaanketVedtaksdato: builder.mutation<IModifiedResponse, IPaaanketVedtaksdatoParams>({
      query: ({ oppgaveId, paaanketVedtaksdato }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/paaanketvedtaksdato`,
        method: 'PUT',
        body: { date: paaanketVedtaksdato },
      }),
      onQueryStarted: async ({ oppgaveId, paaanketVedtaksdato }, { queryFulfilled, dispatch }) => {
        const undo = updateBehandling(oppgaveId, [['paaanketVedtaksdato', paaanketVedtaksdato]], dispatch);

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
        } catch {
          undo();
        }
      },
    }),
    setSaksnummerHosTrygderetten: builder.mutation<IModifiedResponse, ISaksnummerHosTrygderettenParams>({
      query: ({ oppgaveId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/trygderettensaksnummer`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async ({ oppgaveId, trygderettenSaksnummer }, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if ('trygderettenSaksnummer' in draft) {
              draft.trygderettenSaksnummer = trygderettenSaksnummer;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          updateBehandling(oppgaveId, [['modified', data.modified]], dispatch);
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

const updateBehandling = <K extends keyof IOppgavebehandling>(
  oppgaveId: string,
  values: [K, IOppgavebehandling[K]][],
  dispatch: Dispatch,
) => {
  const patchResult = dispatch(
    behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
      for (const [key, value] of values) {
        draft[key] = value;
      }
    }),
  );

  return patchResult.undo;
};

const updateOppgaveData = <K extends keyof IOppgave>(
  oppgaveId: string,
  values: [K, IOppgave[K]][],
  dispatch: Dispatch,
) => {
  const patchResult = dispatch(
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
  useSetPaaanketVedtaksdatoMutation,
  useSetSaksnummerHosTrygderettenMutation,
} = behandlingsdetaljerMutationSlice;
