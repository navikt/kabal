import { reduxStore } from '../../../redux/configure-store';
import { SaksTypeEnum } from '../../../types/kodeverk';
import { IOppgavebehandling, ISakspart } from '../../../types/oppgavebehandling/oppgavebehandling';
import {
  IFinishOppgavebehandlingParams,
  IKjennelseMottattParams,
  IMottattKlageinstansParams,
  IMottattVedtaksinstansParams,
  IOppgavebehandlingHjemlerUpdateParams,
  ISendtTilTrygderettenParams,
  ISetFullmektigParams,
} from '../../../types/oppgavebehandling/params';
import { IModifiedResponse, IVedtakFullfoertResponse } from '../../../types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { kvalitetsvurderingV1Api } from '../../kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '../../kaka-kvalitetsvurdering/v2';
import { ListTagTypes } from '../../tag-types';
import { OppgaveListTagTypes, OppgaveTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const behandlingerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, IFinishOppgavebehandlingParams>({
      query: ({ oppgaveId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullfoer`,
        method: 'POST',
      }),
      extraOptions: { maxRetries: 0 },
      onQueryStarted: async ({ oppgaveId, kvalitetsvurderingId: id }, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        update(oppgaveId, [
          ['modified', data.modified],
          ['isAvsluttetAvSaksbehandler', data.isAvsluttetAvSaksbehandler],
        ]);
        dispatch(oppgaverApi.util.invalidateTags([{ type: OppgaveTagTypes.OPPGAVEBEHANDLING, id: oppgaveId }]));
        dispatch(kvalitetsvurderingV2Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
        dispatch(kvalitetsvurderingV1Api.util.invalidateTags([{ type: 'kvalitetsvurdering', id }]));
      },
    }),
    setMottattKlageinstans: builder.mutation<IModifiedResponse, IMottattKlageinstansParams>({
      query: ({ oppgaveId, mottattKlageinstans }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/mottattklageinstans`,
        method: 'PUT',
        body: { date: mottattKlageinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattKlageinstans, type }, { dispatch, queryFulfilled }) => {
        if (type === SaksTypeEnum.ANKE) {
          const undo = update(oppgaveId, [['mottattKlageinstans', mottattKlageinstans]]);

          try {
            const { data } = await queryFulfilled;
            update(oppgaveId, [['modified', data.modified]]);
            dispatch(getInvalidateAction(oppgaveId));
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
        body: { date: mottattVedtaksinstans },
      }),
      onQueryStarted: async ({ oppgaveId, mottattVedtaksinstans, type }, { dispatch, queryFulfilled }) => {
        if (type === SaksTypeEnum.KLAGE) {
          const undo = update(oppgaveId, [['mottattVedtaksinstans', mottattVedtaksinstans]]);

          try {
            const { data } = await queryFulfilled;
            update(oppgaveId, [['modified', data.modified]]);
            dispatch(getInvalidateAction(oppgaveId));
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
    updateFullmektig: builder.mutation<IModifiedResponse, ISetFullmektigParams>({
      query: ({ oppgaveId, fullmektig: { person, virksomhet } }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/fullmektig`,
        method: 'PUT',
        body: { identifikator: person?.foedselsnummer ?? virksomhet?.virksomhetsnummer ?? null },
      }),
      onQueryStarted: async ({ oppgaveId, fullmektig }, { queryFulfilled }) => {
        const undo = update(oppgaveId, [['prosessfullmektig', fullmektig]]);

        try {
          const { data } = await queryFulfilled;
          update(oppgaveId, [['modified', data.modified]]);
        } catch {
          undo();
        }
      },
    }),
    searchFullmektig: builder.query<ISakspart, string>({
      query: (identifikator) => ({
        url: `/kabal-api/searchfullmektig`,
        method: 'POST',
        body: { identifikator },
      }),
    }),
  }),
});

const getInvalidateAction = (oppgaveId: string) =>
  oppgaverApi.util.invalidateTags([
    { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: oppgaveId },
    { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
    { type: OppgaveListTagTypes.ENHETENS_TILDELTE_OPPGAVER, id: oppgaveId },
    { type: OppgaveListTagTypes.ENHETENS_TILDELTE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
  ]);

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
  useUpdateFullmektigMutation,
  useLazySearchFullmektigQuery,
} = behandlingerMutationSlice;
